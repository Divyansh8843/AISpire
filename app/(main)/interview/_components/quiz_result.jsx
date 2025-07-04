import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Trophy, XCircle } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
const QuizResult = ({ result, hideStartNew = false, onStartNew }) => {
  if (!result) return null;
  return (
    <div className="mx-auto">
      <h1 className="text-3xl font-medium gap-2 flex items-center bg-gradient-to-b from-gray-400 via-gray-200 to-gray-600 text-transparent tracking-tighter bg-clip-text pb-2 pr-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Result
      </h1>
      <CardContent>
        <div className="flex flex-col items-center mb-4 gap-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={result.quizScore} className="w-full" />
        </div>
        {result.improvementTip && (
          <div className="bg-muted p-4 mb-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}
        <div className="space-y-4 mb-4">
          <h3 className="font-medium">Question Review</h3>
          {result.questions.map((que, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <p className="font-medium">{que.question}</p>
                {que.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 " />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your Answer: {que.userAnswer}</p>
                {!que.isCorrect && <p>Correct Answer: {que.answer}</p>}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{que.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {!hideStartNew && (
        <CardFooter>
          <Button className="w-full" onClick={onStartNew}>
            Start New Quiz
          </Button>
        </CardFooter>
      )}
    </div>
  );
};

export default QuizResult;
