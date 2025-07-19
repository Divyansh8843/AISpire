"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_TIPS = [
  "Use a clean, standard resume format with clear section headings.",
  "Include relevant industry keywords from the job description.",
  "Quantify achievements with numbers and metrics.",
  "Use consistent fonts, bullet points, and spacing.",
  "Avoid graphics, tables, or unusual layouts that confuse ATS.",
  "Keep your resume concise, ideally 1-2 pages.",
  "Proofread for spelling and grammar errors.",
  "List skills and technologies relevant to your target role."
];

function ScoreRing({ score }) {
  // SVG progress ring
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.max(0, Math.min(score, 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  let color = "#e5e7eb";
  if (score >= 80) color = "#22c55e"; // green
  else if (score >= 60) color = "#eab308"; // yellow
  else if (score >= 0) color = "#ef4444"; // red
  return (
    <svg height={radius * 2} width={radius * 2} className="mx-auto block">
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference + " " + circumference}
        style={{ strokeDashoffset, transition: "stroke-dashoffset 1s" }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fontSize="1.5rem"
        fontWeight="bold"
        fill={color}
        dy=".3em"
      >
        {score}
      </text>
    </svg>
  );
}

export default function ResumeATSScore() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [tips, setTips] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setScore(null);
    setTips([]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF, DOCX, DOC, ODT, RTF, or TXT resume file.");
      return;
    }
    setLoading(true);
    setError("");
    setScore(null);
    setTips([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setScore(data.score);
        setTips(data.tips);
        // Show notification based on score
        if (data.score >= 80) {
          toast.success(`Great! Your ATS score is ${data.score}/100. Your resume is highly compatible!`, { duration: 5000 });
        } else if (data.score >= 60) {
          toast.warning(`Your ATS score is ${data.score}/100. Some improvements needed.`, { duration: 5000 });
        } else {
          toast.error(`Your ATS score is ${data.score}/100. Consider improving your resume for better results.`, { duration: 5000 });
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col md:flex-row gap-4 items-stretch">
      <Card className="flex flex-col items-center w-fit justify-center shadow-lg border border-border bg-background/95 px-10 py-6 mx-auto md:mx-0 h-fit">
        <CardHeader className="w-full text-center">
          <CardTitle className="text-lg md:text-xl">ATS Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2 w-full flex-1 justify-center">
          <form onSubmit={handleUpload} className="flex flex-col gap-2 w-full">
            <Input
              type="file"
              accept=".pdf,.docx,.doc,.odt,.rtf,.txt"
              onChange={handleFileChange}
            />
            <Button type="submit" disabled={loading} className="w-full text-base">
              {loading ? "Analyzing..." : "Get ATS Score"}
            </Button>
          </form>
          {error && (
            <div className="flex items-center gap-2 text-red-500 mt-1">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}
          {score !== null && (
            <div className="mt-4 flex flex-col items-center justify-center">
              <ScoreRing score={score} />
              <div className="text-2xl font-bold text-primary mt-2">{score}/100</div>
              <div className="text-sm text-muted-foreground mt-1">ATS Compatibility</div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Improvement Tips Card (large, right) */}
      <Card className="flex flex-col items-center w-full justify-center shadow-lg p-6 mx-auto md:mx-0 h-fit">
        <CardHeader className="w-full text-center pb-2">
          <CardTitle className="text-2xl md:text-3xl">Improvement Tips</CardTitle>
          <div className="text-muted-foreground text-base mt-1">Actionable suggestions to boost your ATS score.</div>
        </CardHeader>
        <CardContent className="flex flex-col justify-center flex-1">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(tips.length > 0 ? tips : DEFAULT_TIPS).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-base p-4 text-foreground font-medium bg-background/80 rounded-lg shadow-sm border border-border">
                <span className="inline-block align-middle mt-1"><Lightbulb className="w-5 h-5 text-yellow-400 animate-pulse" /></span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
} 