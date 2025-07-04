import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Brain } from "lucide-react";
const StatsCard = ({ assesments }) => {
  const getAverageScore = () => {
    if (!assesments?.length) return 0;
    const total = assesments.reduce(
      (sum, assesment) => (sum += assesment.quizScore),
      0
    );
    return (total / assesments.length).toFixed(1);
  };
  const getLatestAsssesment = () => {
    if (!assesments.length) return null;
    return assesments[0];
  };
  const getTotalQuestions = () => {
    if (!assesments.length) return 0;
    const total = assesments.reduce(
      (sum, assesment) => (sum += assesment.questions.length),
      0
    );
    return total;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getAverageScore()}%</div>
          <p className="text-xs text-muted-foreground">Across all assesments</p>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">
            Questions practised
          </CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getTotalQuestions()}</div>
          <p className="text-xs text-muted-foreground">Total questions</p>
        </CardContent>
      </Card>

      <Card className="bg-background">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {getLatestAsssesment()?.quizScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs text-muted-foreground">Most recent quiz</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
