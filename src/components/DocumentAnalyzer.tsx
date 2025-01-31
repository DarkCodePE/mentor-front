'use client';

import React, { useState } from 'react';
import { FilePlus, FileCheck, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

interface AnalysisResult {
    team_id: string;
    initial_evaluation?: any;
    critical_evaluation?: any;
    mentor_report?: any;
    status: string;
    created_at: string;
}
const MENTOR_SERVER =  process.env.NEXT_PUBLIC_MENTOR_SERVER || 'http://localhost:9004';

export const DocumentAnalyzer = () => {
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
            toast.success('File uploaded successfully');
        } else {
            toast.error('Please upload a .docx file');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile?.name.endsWith('.docx')) {
            setFile(selectedFile);
            toast.success('File uploaded successfully');
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
            const endpoint = '/api/v1/interviews/analyze-document'
            const response = await fetch(`${MENTOR_SERVER}${endpoint}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Analysis failed');

            const data = await response.json();
            setResult(data);
            toast.success('Analysis completed successfully', {
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
                <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                    Document Analyzer
                </h1>

                <div
                    className={`relative border-4 border-dashed rounded-xl p-8 transition-all duration-300 ${
                        isDragging
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-gray-300 bg-white'
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
                                        'Analyze Document'
                                    )}
                                </button>
                            </div>
                        ) : (
                            <>
                                <FilePlus className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-lg text-gray-600 mb-4">
                                    Drag and drop your document here, or click to select
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
                                    Select File
                                </label>
                            </>
                        )}
                    </div>
                </div>

                {result && (
                    <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
                        <div className="space-y-4">
                            {Object.entries(result).map(([key, value]) => (
                                <div key={key} className="border-b pb-4">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                                        {key.replace(/_/g, ' ').toUpperCase()}
                                    </h3>
                                    <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};