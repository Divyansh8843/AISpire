"use client";
import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/user-fetch";
import { createCoverLetter } from "@/actions/coverletter.js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GenerateCoverLetter = () => {
  const router = useRouter();
  const [coverLetter, setCoverLeter] = useState(null);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
    },
  });
  const {
    loading: generatingCoverLetter,
    data: generatedCoverLetter,
    fn: generateCoverLetterFn,
    error: generateError,
  } = useFetch(createCoverLetter);

  const onSubmit = async (values) => {
    try {
      if (!values.jobTitle || !values.companyName || !values.jobDescription) {
        toast.error("Please fill in all required fields");
        return;
      }
      await generateCoverLetterFn(values);
    } catch (err) {
      toast.error(err.message || "Failed to generate CoverLetter");
    }
  };

  useEffect(() => {
    if (generatedCoverLetter && !generatingCoverLetter) {
      toast.success("CoverLetter generated successfully");
      if (generatedCoverLetter.id) {
        router.push(`/cover-letter/${generatedCoverLetter.id}`);
        router.refresh();
      }
      reset();
    }
    if (generateError) {
      toast.error(generateError.message || "Failed to generate CoverLetter");
    }
  }, [generatedCoverLetter, generatingCoverLetter, generateError, router, reset]);

  return (
    <div>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            CoverLetter Information
          </CardTitle>
          <CardDescription>
            Provide information about the job's position you're applying for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div className="space-y-2">
                <Input
                  error={errors.jobTitle}
                  placeholder="Title/Position"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  error={errors.companyName}
                  placeholder="Name of your Company"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Textarea
                className="h-32"
                placeholder="Description of your job"
                {...register("jobDescription")}
                error={errors.jobDescription}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
            <Button disabled={generatingCoverLetter} type="submit">
              {generatingCoverLetter ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating CoverLetter..
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 " />
                  Generate CoverLetter
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateCoverLetter;
