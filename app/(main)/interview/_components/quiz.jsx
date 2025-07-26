"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useFetch from "@/hooks/user-fetch";
import { Button } from "@/components/ui/button";
import QuizResult from "./quiz_result";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BarLoader } from "react-spinners";
import { generateQuiz } from "@/actions/interview";
import { saveQuizResult } from "@/actions/interview";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const Quiz = () => {
  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);
  const {
    loading: savingResult,
    fn: saveResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);
  const [ans, setAns] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currQues, setCurrQues] = useState(0);

  const handleAnswer = (answer) => {
    const newAns = [...ans];
    newAns[currQues] = answer;
    setAns(newAns);
  };

  const handleNext = () => {
    if (quizData && currQues < quizData.length - 1) {
      setCurrQues(currQues + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    if (!quizData || !ans) return 0;
    let correct = 0;
    ans.forEach((answer, indx) => {
      if (answer === quizData[indx]?.correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      if (!quizData || !ans || ans.length !== quizData.length) {
        toast.error("Quiz data is incomplete.");
        return;
      }
      await saveResultFn({ questions: quizData, answers: ans, score });
      toast.success("Quiz Completed!");
    } catch (err) {
      toast.error(err.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrQues(0);
    setAns([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  useEffect(() => {
    if (quizData && Array.isArray(quizData)) {
      setAns(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  if (generatingQuiz) {
    return <BarLoader className="mt-4 mx-2" width={"100%"} color="gray" />;
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Ready To Practice your interview skills</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions related to your industry. Please
            attempt all questions to test and improve your interview skills.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizFn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Safety check for quizData
  if (!Array.isArray(quizData) || quizData.length === 0) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Error Loading Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was an error loading the quiz. Please try again.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizFn}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currQues];
  
  // Safety check for question
  if (!question || !question.options) {
    return (
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Error Loading Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            There was an error loading the question. Please try again.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizFn}>
            Retry
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="mx-2 bg-background">
      <CardHeader>
        <CardTitle>
          Question {currQues + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-base font-medium">{question.question}</p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={ans[currQues]}
        >
          {question.options?.map((option, indx) => {
            return (
              <div className="flex items-center space-x-2" key={indx}>
                <RadioGroupItem value={option} id={`option-${indx}`} />
                <Label htmlFor={`option-${indx}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>
        {showExplanation && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!ans[currQues]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="outline"
          className="ml-auto"
          disabled={!ans[currQues] || savingResult}
        >
          {savingResult && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {currQues < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
