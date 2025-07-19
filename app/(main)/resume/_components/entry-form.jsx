"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkle, Sparkles, X } from "lucide-react";
import { entrySchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/user-fetch";
import { parse, format } from "date-fns";
import { improveResume } from "@/actions/resume";

const EntryForm = ({ type, entries, onChange }) => {
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = parse(dateString, "yyyy-MM", new Date());
    return format(date, "MMMM yyyy");
  };
  const {
    loading: isimprovingContent,
    data: improvedContent,
    fn: improveContentFn,
    error: improveError,
  } = useFetch(improveResume);
  const [isAdding, setIsAdding] = useState(false);
  // Get today's date in yyyy-MM format
  const today = format(new Date(), "yyyy-MM");
  const {
    control,
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: today,
      endDate: today,
      description: "",
      current: false,
    },
  });
  const current = watch("current");
  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: formatDisplayDate(data.endDate),
    };
    console.log(formattedEntry.startDate);
    onChange([...entries, formattedEntry]);
    reset();
    setIsAdding(false);
  });
  const handleDelete = (idx) => {
    const newEntries = entries.filter((_, i) => i !== idx);
    onChange(newEntries);
  };
  const handleImprovedDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please Enter the Description First");
      return;
    }
    await improveContentFn({ current: description, type: type.toLowerCase() });
  };
  const handleCurrentChange = (e) => {
    setValue("current", e.target.checked);
    if (e.target.checked) {
      setValue("endDate", today);
    } else {
      setValue("endDate", today);
    }
  };
  useEffect(() => {
    if (improvedContent && !isimprovingContent) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve Description");
    }
  }, [improvedContent, isimprovingContent, improveError]);
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {entries.map((entry, idx) => {
          return (
            <Card key={idx} className="bg-background">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {entry.title} @ {entry.organization}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => handleDelete(idx)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {!entry.current
                    ? `${entry.startDate}-${entry.endDate}`
                    : `${entry.startDate} - Present`}
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {entry.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {isAdding && (
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  error={errors.title}
                  placeholder="Title/Position"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  error={errors.organization}
                  placeholder="Organization/Company"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  error={errors.startDate}
                  type="month"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  error={errors.endDate}
                  disabled={current}
                  value={current ? today : undefined}
                  type="month"
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="current"
                {...register("current")}
                onChange={handleCurrentChange}
              />
              <label htmlFor="current">Current {type}</label>
            </div>
            <div className="space-y-2">
              <Textarea
                className="h-32"
                placeholder={`Description of your ${type.toLowerCase()}`}
                {...register("description")}
                error={errors.description}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImprovedDescription}
              disabled={isimprovingContent || !watch("description")}
            >
              {isimprovingContent ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Improving..
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={() => handleAdd()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
