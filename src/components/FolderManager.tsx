"use client";

import React, { useState, useEffect } from 'react';
import {FolderPlus, Upload, File, ChevronRight, ChevronDown, Search, Loader2, RefreshCw} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import DocumentCard from "@/components/file/DocumentCard";
import LoadingAnalysis from "@/components/share/LoadingAnalysis";
import {FolderHeader} from "@/components/folder/FolderHeader";
import {FolderCreationForm} from "@/components/form/FolderCreationForm";
import {useFolderRulesStore} from "@/store/folderRulesStore";
import {ALLOWED_CHILD_TYPES, FOLDER_HIERARCHY, FolderType} from "@/lib/constans";
import {AnalysisResult, CreateFolderData, DocumentData, FolderData, LoadingStates} from "@/model/schema";

// Importar AnalysisReport de forma dinámica para evitar problemas de hidratación
const AnalysisReport = dynamic(() => import('@/components/AnalysisReport'), {
    loading: () => <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>,
    ssr: false
});


// Constants
const FILE_SERVER = process.env.NEXT_PUBLIC_FILE_SERVER || 'http://localhost:9014';
const MENTOR_SERVER = process.env.NEXT_PUBLIC_MENTOR_SERVER || 'http://localhost:9004';

// Main Component
const FolderManager = () => {
    const [folderStructure, setFolderStructure] = useState<FolderData[]>([]);
    const [expandedFolders, setExpandedFolders] = useState(new Set<number>());
    const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const [isSyncingDrive, setIsSyncingDrive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    // En FolderManager, añadimos estado para el ID de la carpeta que se está sincronizando
    const [syncingFolderId, setSyncingFolderId] = useState<string | null>(null);
    const setCurrentLevel = useFolderRulesStore((state) => state.setCurrentLevel);
    // Estados para creación de carpetas raíz
    const [newRootFolderName, setNewRootFolderName] = useState('');
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);

    useEffect(() => {
        fetchFolderStructure();
    }, []);

    const fetchFolderStructure = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${FILE_SERVER}/drive/root_structure`);
            if (!response.ok) throw new Error('Failed to fetch folder structure');
            const data = await response.json();

            // Add folder_type recursively to the structure
            const addFolderTypes = (folders: FolderData[], parentType: FolderType | 'root' = 'root'): FolderData[] => {
                return folders.map(folder => {
                    // Determine the folder type based on parent type and position
                    let folderType: FolderType;
                    if (parentType === 'root') {
                        folderType = 'project';
                    } else if (parentType === 'project') {
                        folderType = folder.name.toLowerCase().includes('avance') ? 'avances' : 'sesiones';
                    } else if (parentType === 'avances') {
                        folderType = 'equipo';
                    } else if (parentType === 'sesiones') {
                        folderType = 'tema';
                    } else {
                        folderType = folder.folder_type || 'project';
                    }

                    return {
                        ...folder,
                        folder_type: folderType,
                        children: folder.children ? addFolderTypes(folder.children, folderType) : []
                    };
                });
            };

            const processedData = addFolderTypes(data);
            setFolderStructure(processedData);
        } catch (error) {
            console.error('Error fetching folder structure:', error);
            toast.error('Failed to fetch folder structure');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Limpiar el estado cuando no hay documento seleccionado
        if (!selectedDocument) {
            setShowAnalysis(false);
            setAnalysisResult(null);
        }
    }, [selectedDocument]);

    useEffect(() => {
        // Establecer el nivel inicial
        setCurrentLevel('root');
        fetchFolderStructure();
    }, []);

    const handleCreateRootFolder = async () => {
        if (!newRootFolderName.trim()) {
            toast.error('Please enter a folder name');
            return;
        }

        setIsCreatingFolder(true);
        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newRootFolderName,
                    folder_type: 'project'
                }),
            });

            if (!response.ok) throw new Error('Failed to create folder');

            await fetchFolderStructure();
            setNewRootFolderName('');
            toast.success('Project folder created successfully');
        } catch (error) {
            toast.error('Error creating folder');
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const handleCreateSubfolder = async (parentId: number, folderData: { name: string, type: FolderType, teamId?: string }) => {
        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: folderData.name,
                    folder_type: folderData.type,
                    parent_folder_id: parentId,
                    team_id: folderData.teamId
                }),
            });

            if (!response.ok) throw new Error('Failed to create subfolder');

            await fetchFolderStructure();
            toast.success('Subfolder created successfully');
        } catch (error) {
            toast.error('Error creating subfolder');
            console.error('Error:', error);
        }
    };


    // Función para sincronizar una carpeta específica
    const syncFolder = async (folderId: string) => {
        setSyncingFolderId(folderId);
        const toastId = toast.loading('Syncing folder...');

        try {
            const formData = new FormData();
            formData.append('folder_id', folderId);

            const response = await fetch(`${FILE_SERVER}/drive/sync`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to sync folder: ${response.statusText}`);
            }

            await fetchFolderStructure();
            toast.success('Folder synced successfully!', { id: toastId });
        } catch (error: any) {
            toast.error(`Error syncing folder: ${error.message}`, { id: toastId });
            console.error('Folder sync error:', error);
        } finally {
            setSyncingFolderId(null);
        }
    };

    const syncDrive = async (folderId?: string) => {
        setIsSyncingDrive(true);
        const toastId = toast.loading('Syncing Drive files...');

        try {
            const formData = new FormData();
            if (folderId) {
                formData.append('folder_id', folderId);
            }

            const response = await fetch(`${FILE_SERVER}/drive/sync`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to sync drive: ${response.statusText}`);
            }

            await fetchFolderStructure();
            toast.success('Drive files synced successfully!', { id: toastId });
        } catch (error: any) {
            toast.error(`Error syncing drive files: ${error.message}`, { id: toastId });
            console.error('Drive sync error:', error);
        } finally {
            setIsSyncingDrive(false);
        }
    };

    const toggleFolder = (folderId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newFolderName,

                }),
            });

            if (!response.ok) throw new Error('Failed to create folder');

            await fetchFolderStructure();
            setNewFolderName('');
            toast.success('Folder created successfully');
        } catch (error) {
            toast.error('Error creating folder');
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const analyzeDocument = async (document: DocumentData) => {
        setIsAnalyzing(true);
        setSelectedDocument(document);
        setShowAnalysis(true);

        try {
            // Si el documento ya fue procesado, obtener el análisis existente
            if (document.processed) {
                const analysisResponse = await fetch(`${FILE_SERVER}/drive/analyze-document/${document.file_id}`);

                if (analysisResponse.ok) {
                    const data = await analysisResponse.json();
                    setAnalysisResult(data);
                    toast.success('Analysis loaded successfully');
                } else {
                    throw new Error('Failed to load existing analysis');
                }
            } else {
                // Si no ha sido procesado, crear nuevo análisis
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

                // Actualizar el estado processed del documento
                const updateResponse = await fetch(`${FILE_SERVER}/drive/documents/${document.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ processed: true }),
                });

                if (!updateResponse.ok) {
                    console.warn('Failed to update document processed status');
                }

                // Recargar la estructura de carpetas para reflejar el nuevo estado
                await fetchFolderStructure();

                toast.success('Analysis completed successfully');
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

        setLoadingStates(prev => ({ ...prev, [`upload-${folderId}`]: true }));
        const toastId = toast.loading('Uploading file...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders/${folderId}/files`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload file');

            toast.success('File uploaded successfully', { id: toastId });
            fetchFolderStructure();
        } catch (error) {
            toast.error('Error uploading file', { id: toastId });
            console.error('Error:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [`upload-${folderId}`]: false }));
        }
    };

    const handleCreateFolder = async (name: string, type: FolderType, teamId: string) => {
        if (!name.trim()) {
            toast.error('Please enter a folder name');
            return;
        }

        setIsCreatingFolder(true);
        try {
            const response = await fetch(`${FILE_SERVER}/drive/folders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    type,
                    team_id: teamId,
                    parent_folder_id: null // o el ID de la carpeta padre si es necesario
                }),
            });

            if (!response.ok) throw new Error('Failed to create folder');

            await fetchFolderStructure();
            toast.success('Folder created successfully');
        } catch (error) {
            toast.error('Error creating folder');
        } finally {
            setIsCreatingFolder(false);
        }
    };

    const renderFolderStructure = (folders: FolderData[]) => {
        return folders.map(folder => {
            // Si folder_type es undefined, asumimos que es 'project' para carpetas existentes
            console.log('Current folder:', folder);
            const folderType = folder.folder_type || 'project';
            console.log('Folder type:', folderType);
            const allowedChildTypes = FOLDER_HIERARCHY[folderType] || [];
            console.log('Allowed child types:', allowedChildTypes);


            console.log('Current folder:', folder);
            console.log('Folder type:', folderType);
            console.log('Allowed types:', allowedChildTypes);
            return (
                <div key={folder.id} className="ml-4">
                    <FolderHeader
                        folder={{...folder, folder_type: folderType}}
                        isExpanded={expandedFolders.has(folder.id)}
                        onToggle={() => toggleFolder(folder.id)}
                        onCreateSubfolder={handleCreateSubfolder}
                        onSync={() => syncFolder(folder.google_drive_folder_id)}
                        onUpload={(e) => handleFileUpload(e, folder.id)}  // Añade esta línea
                        isSyncing={syncingFolderId === folder.google_drive_folder_id}
                        loadingStates={loadingStates}
                        allowedChildTypes={allowedChildTypes}
                    />

                    {expandedFolders.has(folder.id) && (
                        <>
                            {folder.documents.map(doc => (
                                <div key={doc.id} className="ml-6 py-2">
                                    <DocumentCard
                                        doc={doc}
                                        isAnalyzing={isAnalyzing}
                                        selectedDocument={selectedDocument}
                                        analysisResult={analysisResult}
                                        onAnalyze={analyzeDocument}
                                        onViewAnalysis={handleViewAnalysis}
                                        showAnalysis={selectedDocument?.id === doc.id && showAnalysis}
                                        isLoadingAnalysis={isLoadingAnalysis}
                                    />
                                    {selectedDocument?.id === doc.id && showAnalysis && (
                                        <div className="mt-4">
                                            {isLoadingAnalysis ? (
                                                <LoadingAnalysis />
                                            ) : analysisResult ? (
                                                <AnalysisReport result={analysisResult} />
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {folder.children.length > 0 && renderFolderStructure(folder.children)}
                        </>
                    )}
                </div>
            );
        });
    };

    const handleViewAnalysis = async (doc: DocumentData) => {
        // Si es el mismo documento que está seleccionado actualmente
        if (selectedDocument?.id === doc.id) {
            // Solo alternamos la visibilidad
            setShowAnalysis(!showAnalysis);
            return;
        }

        // Si es un documento diferente
        setIsLoadingAnalysis(true);
        setSelectedDocument(doc);

        try {
            const response = await fetch(`${FILE_SERVER}/drive/analyze-document/${doc.file_id}`);
            if (response.ok) {
                const data = await response.json();
                setAnalysisResult(data);
                setShowAnalysis(true); // Mostramos el análisis cuando se carga exitosamente
            } else {
                throw new Error('Failed to load analysis');
            }
        } catch (error) {
            console.error('Error loading analysis:', error);
            toast.error('Failed to load analysis');
            setShowAnalysis(false);
            setSelectedDocument(null);
        } finally {
            setIsLoadingAnalysis(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="mt-4 text-gray-600">Loading folder structure...</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster position="top-right"/>
            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold text-gray-800">Document Repository</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => syncDrive()}
                            disabled={isSyncingDrive}
                        >
                            <RefreshCw className={cn(
                                "w-4 h-4 mr-2",
                                isSyncingDrive && "animate-spin"
                            )}/>
                            Sync All
                        </Button>
                    </div>
                    <FolderCreationForm
                        onSubmit={handleCreateFolder}
                        parentType="root"
                        isCreating={isCreatingFolder}
                    />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    {folderStructure.length > 0 ? (
                        renderFolderStructure(folderStructure)
                    ) : (
                        <div className="text-center py-8">
                            <FolderPlus className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                            <p className="text-gray-500">No folders found</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Create a new folder or sync with Drive to get started
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default FolderManager;