"use client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import QuizResult from "./quiz_result";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
const QuizList = ({ assesments }) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  return (
    <>
      <Card className="bg-background">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-3xl md:text-4xl bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-2 pr-2">
              Recent Quizzes
            </CardTitle>
            <CardDescription>Review your Past Quiz Performance</CardDescription>
          </div>
          <Button onClick={() => router.push("/interview/mock")}>
            Start New Quiz
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assesments.map((assesment, idx) => {
              return (
                <Card
                  key={assesment.id}
                  className="bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedQuiz(assesment)}
                >
                  <CardHeader>
                    <CardTitle>Quiz {idx + 1}</CardTitle>
                    <CardDescription className="flex flex-row justify-between items-center">
                      <div>score: {assesment.quizScore.toFixed(1)}%</div>
                      <div>
                        {" "}
                        {format(
                          new Date(assesment.createdAt),
                          "MMMM dd yyyy HH:mm"
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assesment.improvementTip}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto"  data-lenis-prevent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            onStartNew={() => router.push("/interview/mock")}
            hideStartNew
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizList;
