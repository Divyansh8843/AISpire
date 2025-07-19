import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import formidable from "formidable";
import textract from "textract";
import fileType from "file-type";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.oasis.opendocument.text",
  "application/rtf",
  "text/plain",
];
const SUPPORTED_EXTS = [".pdf", ".docx", ".doc", ".odt", ".rtf", ".txt"];

async function parseFile(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

async function getActualFileType(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const type = await fileType.fromBuffer(buffer);
    return type;
  } catch {
    return null;
  }
}

async function isSupportedFile(file) {
  const ext = (file.originalFilename || file.name || "").toLowerCase();
  const mimetype = file.mimetype?.toLowerCase() || "";
  const type = await getActualFileType(file.filepath || file.path);
  // Check all available info for support
  if (
    SUPPORTED_TYPES.includes(mimetype) ||
    SUPPORTED_EXTS.some((e) => ext.endsWith(e)) ||
    (type && (SUPPORTED_TYPES.includes(type.mime) || SUPPORTED_EXTS.some((e) => type.ext && ("." + type.ext) === e)))
  ) {
    return true;
  }
  return false;
}

async function extractText(file) {
  const filePath = file.filepath || file.path;
  const ext = (file.originalFilename || file.name || "").toLowerCase();
  let mimetype = file.mimetype?.toLowerCase() || "";
  // Try to detect actual file type if mimetype is missing or unreliable
  if (!mimetype || mimetype === "application/octet-stream") {
    const type = await getActualFileType(filePath);
    if (type) {
      mimetype = type.mime;
    }
  }
  // PDF
  if (mimetype === "application/pdf" || ext.endsWith(".pdf")) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      let data = await pdfParse(dataBuffer);
      if (data.text && data.text.trim().length > 0) return data.text;
    } catch {
      // fallback to textract
    }
  }
  // DOCX/DOC
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword" ||
    ext.endsWith(".docx") ||
    ext.endsWith(".doc")
  ) {
    try {
      const data = await mammoth.extractRawText({ path: filePath });
      if (data.value && data.value.trim().length > 0) return data.value;
    } catch {
      // fallback to textract
    }
  }
  // ODT, RTF, TXT, fallback for all
  try {
    return await new Promise((resolve, reject) => {
      textract.fromFileWithPath(filePath, (err, text) => {
        if (err || !text || !text.trim()) return reject(err || new Error("No text extracted"));
        resolve(text);
      });
    });
  } catch {
    // fallback to plain text read for .txt
    if (ext.endsWith(".txt")) {
      try {
        const plainText = fs.readFileSync(filePath, "utf8");
        if (plainText && plainText.trim().length > 0) return plainText;
      } catch {}
    }
  }
  throw new Error(
    "Could not extract text from your file. Please upload a valid, text-based PDF, DOCX, DOC, ODT, RTF, or TXT resume. Images and unsupported formats are not allowed."
  );
}

async function getAtsScoreAndTips(resumeText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured on the server.");
  }
  // Truncate to 3000 chars, but keep start and end for context
  let truncatedText = resumeText;
  if (resumeText.length > 3000) {
    truncatedText = resumeText.slice(0, 2000) + "\n...\n" + resumeText.slice(-1000);
  }
  const prompt = `You are an expert ATS (Applicant Tracking System) resume reviewer for a professional ATS scoring website. Analyze the following resume text and:
- Give an ATS compatibility score from 0 to 100 (higher is better)
- Suggest 5-7 highly actionable, concise, and clear improvement tips
- Each tip should be a short, specific, impactful bullet point (not a paragraph)
- Avoid generic advice; focus on what will most improve the resume's ATS score
- Format the tips as a JSON array of strings, each string being a single, punchy action step
- Respond ONLY in valid JSON: { "score": number, "tips": [string, ...] }
Resume text:
${truncatedText}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500,
      },
    }),
  });
  const data = await response.json();
  try {
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const json = JSON.parse(content.match(/\{[\s\S]*\}/)[0]);
    return json;
  } catch {
    return { score: null, tips: ["Could not parse ATS score. Please try again."] };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { files } = await parseFile(req);
    // Debug: Log the full files object
    console.log("[ATS API] All files object:", files);
    // Accept any uploaded file, handle array or object
    let file = Object.values(files)[0];
    if (Array.isArray(file)) file = file[0];
    if (!file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      res.status(400).json({ error: "File is too large. Max allowed size is 5MB." });
      return;
    }
    // Debug: Log file properties and detected type
    const ext = (file.originalFilename || file.name || "").toLowerCase();
    const mimetype = file.mimetype?.toLowerCase() || "";
    const detectedType = await getActualFileType(file.filepath || file.path);
    console.log("[ATS API] Uploaded file:", file);
    console.log("[ATS API] Extension:", ext);
    console.log("[ATS API] Mimetype:", mimetype);
    console.log("[ATS API] Detected file type:", detectedType);
    if (!(await isSupportedFile(file))) {
      res.status(400).json({
        error: "Unsupported file type. Please upload PDF, DOCX, DOC, ODT, RTF, or TXT.",
        debug: {
          extension: ext,
          mimetype,
          detectedType
        }
      });
      return;
    }
    let resumeText = null;
    try {
      resumeText = await extractText(file);
    } catch (extractErr) {
      res.status(400).json({ error: extractErr.message || "Could not extract text from your file." });
      return;
    }
    try {
      const atsResult = await getAtsScoreAndTips(resumeText);
      res.status(200).json(atsResult);
    } catch (aiErr) {
      res.status(500).json({ error: aiErr.message || "AI scoring failed." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}