import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../../../lib/schema";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { generateCoverLetter } from "@/actions/coverletter";
const CoverLetterForm = () => {
  const {
    control,
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    setValue,
    watch,
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
  } = useFetch(generateCoverLetter);
  const generateCoverLetter = async (values) => {
    await generateCoverLetterFn(values);
  };
  useEffect(() => {
    if (generatedCoverLetter && !generatingCoverLetterCoverLetter) {
      toast.success("CoverLetter generated successfully");
    }
    if (saveError) {
      toast.error(generateError.message || "Failed to save CoverLetter");
    }
  }, [generatedCoverLetter, generatingCoverLetter, generateError]);
  return (
    <div>
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            CoverLetter Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              error={errors.jobTitle}
              placeholder="Title/Position"
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
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
          <div className="space-y-2">
            <Textarea
              className="h-32"
              placeholder="Description of your job"
              {...register("descrjobDescriptionption")}
              error={errors.jobDescription}
            />
            {errors.jobDescription && (
              <p className="text-sm text-red-500">
                {errors.jobDescription.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 items-center">
          <Button disabled={isGenerating} onClick={generateCoverLetter}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating CoverLetter..
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate CoverLetter
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CoverLetterForm;
