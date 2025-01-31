"use client";

import React, { useState } from 'react';
import { FilePlus, FileCheck, Loader2, FileQuestion, Check, AlertTriangle, ChevronRight, BarChart, Award, Book, Flag, Lightbulb, FlaskConical, HelpCircle, Target, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: any;
    critical_evaluation: any;
    mentor_report: any;
    metadata: any;
}

const MENTOR_SERVER = process.env.NEXT_PUBLIC_MENTOR_SERVER || 'http://localhost:9004';

const AnalysisReport = ({ result }: { result: AnalysisResult }) => {
    const scores = [
        { category: "Clarity", value: result.initial_evaluation.clarity.score_interview },
        { category: "Audience", value: result.initial_evaluation.audience.score_interview },
        { category: "Structure", value: result.initial_evaluation.structure.score_interview },
        { category: "Depth", value: result.initial_evaluation.depth.score_interview },
        { category: "Questions", value: result.initial_evaluation.questions.score_interview }
    ];

    return (
        <div className="space-y-6 mt-8">
            {/* Overview Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <BarChart className="w-6 h-6 text-indigo-600" />
                            Analysis Overview
                        </h2>
                        <p className="text-gray-600 mt-1">{result.metadata.file_name}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-indigo-100 rounded-full text-sm font-medium text-indigo-700">
                            Team ID: {result.team_id}
                        </span>
                        <span className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium text-green-700">
                            Score: {result.initial_evaluation.final_score.toFixed(1)}/10
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        Performance Metrics
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scores}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Findings Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Book className="w-6 h-6 text-indigo-600" />
                    Key Findings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 flex items-center gap-2">
                                <Check className="w-5 h-5" />
                                Strengths
                            </h4>
                            <ul className="mt-2 space-y-2">
                                {result.initial_evaluation.clarity.positives.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <ChevronRight className="w-4 h-4 mt-1 text-green-600" />
                                        <span className="text-green-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-amber-50 rounded-lg p-4">
                            <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Areas for Improvement
                            </h4>
                            <ul className="mt-2 space-y-2">
                                {result.initial_evaluation.clarity.improvements.map((point: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <ChevronRight className="w-4 h-4 mt-1 text-amber-600" />
                                        <span className="text-amber-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validated Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-indigo-600" />
                    Validated Insights
                </h3>
                <div className="grid gap-4">
                    {result.mentor_report.validated_insights.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 bg-green-50 p-4 rounded-lg">
                            <Check className="w-5 h-5 mt-1 text-green-600 flex-shrink-0" />
                            <p className="text-green-700">{item.insight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Hypotheses */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <FlaskConical className="w-6 h-6 text-indigo-600" />
                    Pending Hypotheses
                </h3>
                <div className="grid gap-4">
                    {result.mentor_report.pending_hypotheses.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg">
                            <HelpCircle className="w-5 h-5 mt-1 text-amber-600 flex-shrink-0" />
                            <p className="text-amber-700">{item.hypothesis}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Identified Gaps */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6 text-indigo-600" />
                    Identified Gaps
                </h3>
                <div className="grid gap-4">
                    {result.mentor_report.identified_gaps.map((gap: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 bg-red-50 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5 mt-1 text-red-600 flex-shrink-0" />
                            <p className="text-red-700">{gap}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Items */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Flag className="w-6 h-6 text-indigo-600" />
                    Action Items
                </h3>
                <div className="grid gap-4">
                    {result.mentor_report.action_items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-semibold">{index + 1}</span>
                            </div>
                            <p className="text-gray-700 flex-grow">{item.recommendation}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function TeamTaskAnalyzer() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.name.endsWith('.docx')) {
            setFile(droppedFile);
            toast.success('Document uploaded successfully');
        } else {
            toast.error('Please upload a .docx file');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.name.endsWith('.docx')) {
            setFile(selectedFile);
            toast.success('Document uploaded successfully');
        } else {
            toast.error('Please upload a .docx file');
        }
    };

    const analyzeDocument = async () => {
        if (!file) return;

        const loadingToast = toast.loading('Analyzing document...');
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('team_id', 'default-team');

        try {
            const endpoint = '/api/v1/interviews/analyze-document';
            const response = await fetch(`${MENTOR_SERVER}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setResult(data);
            toast.success('Analysis completed', {
                id: loadingToast,
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An error occurred', {
                id: loadingToast,
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Mentor Eval
                    </h1>
                    <p className="text-gray-600">
                        Cargue su documento para obtener un análisis exhaustivo y comentarios
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div
                        className={`relative border-4 border-dashed rounded-xl p-8 transition-all duration-300 ${
                            isDragging
                                ? 'border-indigo-400 bg-indigo-50'
                                : 'border-gray-300'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="text-center">
                            {file ? (
                                <div className="space-y-4">
                                    <FileCheck className="w-16 h-16 mx-auto text-green-500" />
                                    <p className="text-lg text-gray-600">{file.name}</p>
                                    <button
                                        onClick={analyzeDocument}
                                        disabled={isAnalyzing}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {isAnalyzing ? (
                                            <span className="flex items-center gap-2 justify-center">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Analyzing...
                                            </span>
                                        ) : (
                                            'Start Analysis'
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg text-gray-600 mb-4">
                                        Drop your document here, or click to select
                                    </p>
                                    <input
                                        type="file"
                                        accept=".docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="fileInput"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
                                    >
                                        Select Document
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {result && <AnalysisReport result={result} />}
            </div>
        </div>
    );
}