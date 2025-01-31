"use client";

import React, { useState } from 'react';
import { FilePlus, FileCheck, Loader2, FileQuestion } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisResult {
    team_id: string;
    initial_evaluation?: any;
    critical_evaluation?: any;
    mentor_report?: any;
    status: string;
    created_at: string;
}

const MENTOR_SERVER = process.env.NEXT_PUBLIC_MENTOR_SERVER || 'http://localhost:9004';

const AnalysisReport = ({ result }: { result: AnalysisResult }) => {
    if (!result.initial_evaluation) return null;

    const scores = [
        { category: "Clarity", value: result.initial_evaluation.clarity.score_interview },
        { category: "Audience", value: result.initial_evaluation.audience.score_interview },
        { category: "Structure", value: result.initial_evaluation.structure.score_interview },
        { category: "Depth", value: result.initial_evaluation.depth.score_interview },
        { category: "Questions", value: result.initial_evaluation.questions.score_interview }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Mentor</h2>
                    <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                            Team ID: {result.team_id}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 rounded-full text-sm">
                            Final Score: {result.initial_evaluation.final_score.toFixed(1)}/10
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Score Chart */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h3 className="text-lg font-semibold mb-4">Evaluation Scores</h3>
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

                    {/* Key Findings */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h3 className="text-lg font-semibold mb-4">Key Findings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Strengths</h4>
                                <ul className="list-disc pl-6 space-y-2">
                                    {result.initial_evaluation.clarity.positives.map((point: string, i: number) => (
                                        <li key={i} className="text-gray-600">{point}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Areas for Improvement</h4>
                                <ul className="list-disc pl-6 space-y-2">
                                    {result.initial_evaluation.clarity.improvements.map((point: string, i: number) => (
                                        <li key={i} className="text-gray-600">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h3 className="text-lg font-semibold mb-4">Mentor Recommendations</h3>
                        <ul className="space-y-3">
                            {result.initial_evaluation.general_recommendations.map((rec: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="font-medium text-gray-700">{i + 1}.</span>
                                    <p className="text-gray-600">{rec}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TeamTaskAnalyzer = () => {
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
            toast.success('Team task document uploaded successfully');
        } else {
            toast.error('Please upload a .docx file');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.name.endsWith('.docx')) {
            setFile(selectedFile);
            toast.success('Team task document uploaded successfully');
        } else {
            toast.error('Please upload a .docx file');
        }
    };

    const analyzeDocument = async () => {
        if (!file) return;

        const loadingToast = toast.loading('Analyzing team task...');
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
            toast.success('Team task analysis completed', {
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
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Team Task Evaluation Portal
                    </h1>
                    <p className="text-gray-600">
                        Upload your team's task document for comprehensive analysis and feedback
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
                                                Analyzing Task...
                                            </span>
                                        ) : (
                                            'Analyze Task'
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <FileQuestion className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-lg text-gray-600 mb-4">
                                        Drop your team's task document here, or click to select
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
};

export default TeamTaskAnalyzer;