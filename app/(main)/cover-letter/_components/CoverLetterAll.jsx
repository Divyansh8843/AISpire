"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/coverletter";
const CoverLetterAll = ({ coverLetters }) => {
  const router = useRouter();
  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("CoverLetter deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete CoverLetter");
    }
  };
  if (!coverLetters?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  return (
    <div>
      {coverLetters.map((coverLetter) => (
        <Card key={coverLetter.id} className="group relative mb-4">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl gradient-title">
                  {coverLetter.jobTitle} at {coverLetter.companyName}
                </CardTitle>
                <CardDescription>
                  Created {format(new Date(coverLetter.createdAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <AlertDialog>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      router.push(`/cover-letter/${coverLetter.id}`);
                      router.refresh();
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete your cover letter permanently for{" "}
                        {coverLetter.jobTitle} at {coverLetter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(coverLetter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm line-clamp-3">
              {coverLetter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoverLetterAll;
