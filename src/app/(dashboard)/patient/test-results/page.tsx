"use client";

import React, { useState } from "react";
import {
  FileDown,
  Search,
  Calendar,
  FileText,
  AlertCircle,
  Download,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestResult {
  id: string;
  testName: string;
  date: string;
  labName: string;
  status: "normal" | "abnormal" | "critical";
  category: string;
  downloadUrl?: string;
  resultSummary: string;
}

export default function PatientTestResult() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample data - replace with actual data from your backend
  const sampleResults: TestResult[] = [
    {
      id: "1",
      testName: "Complete Blood Count (CBC)",
      date: "2025-01-15",
      labName: "Central Medical Laboratory",
      status: "normal",
      category: "Hematology",
      resultSummary: "All parameters within normal range",
    },
    {
      id: "2",
      testName: "Lipid Panel",
      date: "2025-01-20",
      labName: "HealthFirst Labs",
      status: "abnormal",
      category: "Chemistry",
      resultSummary: "Elevated LDL cholesterol levels",
    },
    {
      id: "3",
      testName: "Thyroid Function Test",
      date: "2025-01-25",
      labName: "Metro Diagnostics",
      status: "critical",
      category: "Endocrinology",
      resultSummary: "Significantly elevated TSH levels",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "abnormal":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
        <p className="text-gray-600 mt-2">
          View and download your laboratory test results
        </p>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Search test results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger>
            <Calendar className="mr-2" size={18} />
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <Filter className="mr-2" size={18} />
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hematology">Hematology</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="endocrinology">Endocrinology</SelectItem>
              <SelectItem value="microbiology">Microbiology</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleResults.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl font-bold">
                  {result.testName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  {formatDate(result.date)}
                </CardDescription>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  result.status
                )}`}
              >
                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
              </span>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Laboratory
                  </p>
                  <p className="text-gray-700">{result.labName}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-700">{result.category}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Summary</p>
                  <p className="text-gray-700">{result.resultSummary}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button className="flex-1 flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Full Report
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {sampleResults.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileDown size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No test results found
          </h3>
          <p className="text-gray-600 mt-2">
            When your test results are ready, they will appear here for you to
            view and download.
          </p>
        </div>
      )}
    </div>
  );
}
