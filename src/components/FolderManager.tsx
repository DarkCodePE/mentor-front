"use client";

import React, { useState, useEffect } from 'react';
import { FolderPlus, Upload, File, ChevronRight, ChevronDown, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnalysisReport from "@/components/AnalysisReport";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FolderData {
    id: number;
    name: string;
    google_drive_folder_id: string;
    parent_id: number | null;
    children: FolderData[];
    documents: DocumentData[];
}

interface DocumentData {
    id: number;
    name: string;
    mime_type: string;
    file_id: string;
    web_view_link?: string;
}

interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: any;
    critical_evaluation: any;
    mentor_report: any;
    metadata: any;
}

const FILE_SERVER = process.env.NEXT_PUBLIC_FILE_SERVER || 'http://localhost:9014';
const MENTOR_SERVER = process.env.NEXT_PUBLIC_MENTOR_SERVER || 'http://localhost:9004';



const FolderManager = () => {
    const [folderStructure, setFolderStructure] = useState<FolderData[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
    const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    useEffect(() => {
        fetchFolderStructure();
    }, []);

    const fetchFolderStructure = async () => {
        try {
            const response = await fetch(`${FILE_SERVER}/drive/root_structure`);
            if (!response.ok) throw new Error('Failed to fetch folder structure');
            const data = await response.json();
            setFolderStructure(data);
        } catch (error) {
            toast.error('Error fetching folder structure');
            console.error('Error:', error);
        }
    };

    const toggleFolder = (folderId: number) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) {
            toast.error('Please enter a folder name');
            return;
        }

        setIsCreatingFolder(true);
        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newFolderName,
                    parent_folder_id: selectedFolderId
                }),
            });

            if (!response.ok) throw new Error('Failed to create folder');

            await fetchFolderStructure();
            setNewFolderName('');
            toast.success('Folder created successfully');
        } catch (error) {
            toast.error('Error creating folder');
            console.error('Error:', error);
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const analyzeDocument = async (document: DocumentData) => {
        setIsAnalyzing(true);
        setSelectedDocument(document);
        try {
            const analysisResponse = await fetch(`${FILE_SERVER}/drive/analyze-document/${document.file_id}`);

            if (analysisResponse.ok) {
                const data = await analysisResponse.json();
                setAnalysisResult(data);
                toast.success('Analysis loaded successfully');
            } else if (analysisResponse.status === 404) {
                const formData = new FormData();
                formData.append('file_id', document.file_id);
                formData.append('team_id', 'default-team');

                const response = await fetch(`${MENTOR_SERVER}/api/v1/interviews/save/analyze-document`, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Analysis failed');

                const data = await response.json();
                setAnalysisResult(data);
                toast.success('Analysis completed successfully');
            } else {
                throw new Error('Failed to check existing analysis');
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An error occurred');
            setAnalysisResult(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, folderId: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders/${folderId}/files`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload file');

            toast.success('File uploaded successfully');
            fetchFolderStructure();
        } catch (error) {
            toast.error('Error uploading file');
            console.error('Error:', error);
        }
    };

    const renderFolderStructure = (folders: FolderData[], level = 0) => {
        return folders.map(folder => (
            <div key={folder.id} className="ml-4">
                <div
                    className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
                    onClick={() => toggleFolder(folder.id)}
                >
                    {folder.children.length > 0 ? (
                        expandedFolders.has(folder.id) ?
                            <ChevronDown className="w-4 h-4 text-gray-500" /> :
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                    ) : (
                        <div className="w-4" />
                    )}
                    <FolderPlus className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700 font-medium">{folder.name}</span>
                    <span className="text-gray-400 text-sm ml-2">
                        ({folder.documents.length} files)
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e) => handleFileUpload(e as any, folder.id);
                            input.click();
                        }}
                    >
                        Upload File
                    </Button>
                </div>

                {expandedFolders.has(folder.id) && (
                    <>
                        {folder.documents.map(doc => (
                            <div key={doc.id} className="ml-6 py-2">
                                <Card className="p-3 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <File className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-600">{doc.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {doc.web_view_link && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(doc.web_view_link, '_blank')}
                                                >
                                                    View
                                                </Button>
                                            )}
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => analyzeDocument(doc)}
                                                disabled={isAnalyzing && selectedDocument?.id === doc.id}
                                            >
                                                {isAnalyzing && selectedDocument?.id === doc.id ? (
                                                    <>
                                                        <Search className="w-4 h-4 animate-spin mr-2" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    'Analyze'
                                                )}
                                            </Button>
                                            {analysisResult && selectedDocument?.id === doc.id && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setAnalysisResult(null)}
                                                >
                                                    View Analysis
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {selectedDocument?.id === doc.id && analysisResult && (
                                    <div className="mt-4">
                                        <AnalysisReport result={analysisResult} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {renderFolderStructure(folder.children, level + 1)}
                    </>
                )}
            </div>
        ));
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Document Repository</h2>
                    <div className="flex gap-4">
                        <Input
                            placeholder="New folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-64"
                        />
                        <Button
                            onClick={createFolder}
                            disabled={isCreatingFolder || !newFolderName.trim()}
                        >
                            Create Folder
                        </Button>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    {folderStructure.length > 0 ? (
                        renderFolderStructure(folderStructure)
                    ) : (
                        <p className="text-gray-500 text-center py-4">No folders found</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FolderManager;