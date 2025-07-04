"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Save,
  Edit,
  Monitor,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { saveResume } from "@/actions/resume";
import MDEditor from "@uiw/react-md-editor";
import { Controller } from "react-hook-form";
import { entriesToMarkdown } from "../../../lib/helper";
import useFetch from "@/hooks/user-fetch";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import EntryForm from "./entry-form";
import { contactSchema, entrySchema, resumeSchema } from "../../../lib/schema";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
const ResumeBuilder = ({ initialContent }) => {
  const [resumeMode, setResumeMode] = useState("preview");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });
  const {
    loading: savingResume,
    data: savedResume,
    fn: saveResumeFn,
    error: saveError,
  } = useFetch(saveResume);
  const [activeTab, setActiveTab] = useState("edit");
  const formValues = watch();
  useEffect(() => {
    if (initialContent) {
      setActiveTab("preview");
    }
  }, [initialContent]);
  useEffect(() => {
    if (savedResume && !savingResume) {
      toast.success("Resume saved successfully");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save Resume");
    }
  }, [savedResume, savingResume, saveError]);
  const onSubmit = async () => {
    try {
      await saveResumeFn(previewContent);
    } catch (err) {
      console.error("save Error", err);
    }
  };
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [initialContent, activeTab]);
  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      console.log(getComputedStyle(element).color);
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.log("PDF GEneration error", err);
    } finally {
      setIsGenerating(false);
    }
  };
  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);
    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };
  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Project"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };
  return (
    <div>
      <h1 className="text-6xl font-bold bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-4 pr-2">
        Resume Builder
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-row items-center justify-between gap-4">
          <div>
            <TabsList>
              <TabsTrigger value="edit">Form</TabsTrigger>
              <TabsTrigger value="preview">Markdown</TabsTrigger>
            </TabsList>
          </div>
          <div className="space-x-2">
            <Button
              variant="destructive"
              onClick={onSubmit}
              disabled={savingResume}
            >
              {savingResume ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Resume...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Resume
                </>
              )}
            </Button>
            <Button disabled={isGenerating} onClick={generatePDF}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF..
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
        <TabsContent value="edit">
          <form className="space-y-4 mt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    error={errors.contactInfo?.email}
                    placeholder="your@gmail.com"
                    {...register("contactInfo.email")}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Mobile Number</Label>
                  <Input
                    type="tel"
                    error={errors.contactInfo?.mobile}
                    placeholder="+91 881 XXX XXXX"
                    {...register("contactInfo.mobile")}
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Linkedin URL</Label>
                  <Input
                    type="url"
                    error={errors.contactInfo?.linkedin}
                    placeholder="https://linkedin.com/in/your-profile"
                    {...register("contactInfo.linkedin")}
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Twitter Profile</Label>
                  <Input
                    type="url"
                    error={errors.contactInfo?.twitter}
                    placeholder="https://twitter.com/in/your-handle"
                    {...register("contactInfo.twitter")}
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your skills..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>
        <TabsContent value="preview">
          <Button
            variant="link"
            type="button"
            className="mb-2"
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Resume
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Preview
              </>
            )}
          </Button>
          {resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 rounded mb-2 border-green-600 text-green-600">
              <AlertTriangle className="h-4 w-4" />

              <p className="text-sm">
                You will lose edited markdown if you update the form data
              </p>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div
              id="resume-pdf"
              style={{
                background: "white",
                color: "#000",
                "--tw-prose-body": "#000",
                "--tw-prose-headings": "#000",
                "--tw-prose-links": "#000",
                "--tw-prose-bold": "#000",
                "--tw-prose-counters": "#000",
                "--tw-prose-bullets": "#000",
                "--tw-prose-hr": "#000",
                "--tw-prose-quotes": "#000",
                "--tw-prose-quote-borders": "#000",
                "--tw-prose-captions": "#000",
                "--tw-prose-code": "#000",
                "--tw-prose-pre-code": "#000",
                "--tw-prose-pre-bg": "#fff",
                "--tw-prose-th-borders": "#000",
                "--tw-prose-td-borders": "#000",
              }}
            >
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "#000",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
