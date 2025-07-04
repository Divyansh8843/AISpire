"use client";
import {
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  Brain,
  TrendingUp,
  Circle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
const DashboardView = ({ insights }) => {
  console.log("Insights data:", insights);
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));
  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return {
          icon: TrendingUp,
          color: "text-green-500",
        };
      case "neutral":
        return {
          icon: LineChart,
          color: "text-yellow-500",
        };
      case "negative":
        return {
          icon: TrendingDown,
          color: "text-red-500",
        };
      default:
        return {
          icon: LineChart,
          color: "text-gray-500",
        };
    }
  };
  const marketOutlookIcon = getMarketOutlookInfo(insights?.marketOutlook).icon;
  const marketOutlookColor = getMarketOutlookInfo(
    insights?.marketOutlook
  ).color;
  console.log(marketOutlookIcon);
  console.log(marketOutlookColor);
  const lastUpdatedDate = format(new Date(insights?.lastUpdated), "dd/MM/yyyy");
  const nextUpdatedDistance = formatDistanceToNow(
    new Date(insights?.nextUpdate),
    { addSuffix: true }
  );
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-2 shadow-md">
          <p className="font-medium">{label}</p>
          {payload.map((item) => (
            <p key={item.name} className="text-sm">
              {item.name}: ${item.value}K
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  console.log(getDemandLevelColor(insights.demandLevel));
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            {React.createElement(marketOutlookIcon, {
              className: `h-4 w-4 ${marketOutlookColor}`,
            })}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.marketOutlook.toLowerCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              Next Update {nextUpdatedDistance}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            ></div>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background col-span-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Salary Ranges by Role
          </CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in K)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Key Industry Trends
            </CardTitle>
            <CardDescription>
              Currents trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-lg"></div>
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recommended Skills
            </CardTitle>
            <CardDescription>
              Skills to focus on for career growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
