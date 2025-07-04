import { parse } from "path";
import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z.string({
    required_error: "Please Select an Industry",
  }),
  subIndustry: z.string({
    required_error: "Please Select a specialization",
  }),
  bio: z.string().max(500).optional(),
  experience: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience must be at least postive")
        .max(50, "Experience cannot exceed 50 years")
    ),
  skills: z.string().transform((val) =>
    val
      ? val
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : undefined
  ),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid Email Address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    description: z.string().min(1, "description is required"),
    current: z.boolean().default(false),
  })
  .refine((data) => data.current || data.endDate, {
    message: "End date is required unless current is checked",
    path: ["endDate"],
  });

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills is required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});

export const jobSchema = z.object({
  jobTitle: z.string().min(1, "Title is required"),
  companyName: z.string().min(1, "companyName  is required"),
  jobDescription: z.string().min(1, "Description is required"),
});
