// components/folder/FolderHeader.tsx
import { useState } from 'react';
import {FolderPlus, ChevronRight, ChevronDown, RefreshCw, Plus, Upload} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


import FolderCreationModal from "@/components/folder/modal/CreateFolderModal";
import {CreateFolderData, FolderData} from "@/model/schema";
import {FOLDER_HIERARCHY, FolderType} from "@/lib/constans";

interface FolderHeaderProps {
    folder: FolderData;
    isExpanded: boolean;
    onToggle: () => void;
    onCreateSubfolder: (folderId: number, data: CreateFolderData) => Promise<void>;
    onSync: (folderId: string) => Promise<void>;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>, folderId: number) => Promise<void>;
    isSyncing: boolean;
    loadingStates: Record<string, boolean>;
    allowedChildTypes: readonly FolderType[];
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({
                                                              folder,
                                                              isExpanded,
                                                              onToggle,
                                                              onCreateSubfolder,
                                                              onSync,
                                                              onUpload,
                                                              isSyncing,
                                                              loadingStates,
                                                              allowedChildTypes
                                                          }) => {
    console.log('Folder type:', folder.folder_type);
    console.log('Allowed child types:', allowedChildTypes);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const isUploading = loadingStates[`upload-${folder.id}`];

    const handleCreateSubmit = async (data: CreateFolderData) => {
        setIsCreating(true);
        try {
            await onCreateSubfolder(folder.id, data);
            setShowCreateModal(false);
        } finally {
            setIsCreating(false);
        }
    };
    //const allowedTypes = FOLDER_HIERARCHY[folder.folder_type as FolderType] || [];
    return (
        <>
            <div className="flex items-center gap-2 py-2 hover:bg-gray-50 rounded-lg px-2">
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700"
                >
                    {folder.children.length > 0 && (
                        isExpanded ?
                            <ChevronDown className="w-4 h-4" /> :
                            <ChevronRight className="w-4 h-4" />
                    )}
                </button>

                <div className="flex items-center gap-2 flex-grow">
                    <FolderPlus className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-700 font-medium">{folder.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
            {folder.folder_type}
          </span>
                </div>

                <div className="flex items-center gap-2">
                    {allowedChildTypes.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCreateModal(true);
                            }}
                            className="flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            New Subfolder
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e) => onUpload(e as any, folder.id);
                            input.click();
                        }}
                        disabled={isUploading}
                    >
                        <Upload className={cn(
                            "w-4 h-4 mr-2",
                            isUploading && "animate-spin"
                        )} />
                        Upload
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSync(folder.google_drive_folder_id);
                        }}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={cn(
                            "w-4 h-4 mr-2",
                            isSyncing && "animate-spin"
                        )} />
                        Sync
                    </Button>
                </div>
            </div>

            <FolderCreationModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateSubmit}
                allowedTypes={allowedChildTypes} // Use the prop directly
                parentType={folder.folder_type}
                isLoading={isCreating}
            />
        </>
    );
};