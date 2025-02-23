import React, { useState, useEffect } from 'react';
import { FolderPlus, Upload, File, ChevronRight, ChevronDown, Search, Loader2, RefreshCw } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Types for folder hierarchy
type FolderType = 'project' | 'avances' | 'sesiones' | 'equipo' | 'tema';

const FOLDER_TYPE_LABELS: Record<FolderType, string> = {
    project: 'Project',
    avances: 'Avances',
    sesiones: 'Sesiones',
    equipo: 'Equipo',
    tema: 'Tema'
};

const ALLOWED_CHILD_TYPES: Record<FolderType | 'root', FolderType[]> = {
    root: ['project'],
    project: ['avances', 'sesiones'],
    avances: ['equipo'],
    sesiones: ['tema'],
    equipo: [],
    tema: []
};

const FolderCreationForm = ({
                                onSubmit,
                                parentType,
                                isCreating
                            }: {
    onSubmit: (name: string, type: FolderType, teamId: string) => void;
    parentType?: FolderType | 'root';
    isCreating: boolean;
}) => {
    const [folderName, setFolderName] = useState('');
    const [folderType, setFolderType] = useState<FolderType | ''>('');
    const [teamId, setTeamId] = useState('');

    const allowedTypes = parentType ? ALLOWED_CHILD_TYPES[parentType] : ALLOWED_CHILD_TYPES.root;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim() || !folderType || !teamId.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }
        onSubmit(folderName, folderType, teamId);
        setFolderName('');
        setFolderType('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4">
            <Input
                placeholder="Team ID"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-32"
            />
            <Input
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-64"
            />
            <Select
                value={folderType}
                onValueChange={(value: FolderType) => setFolderType(value)}
            >
                <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select folder type" />
                </SelectTrigger>
                <SelectContent>
                    {allowedTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {FOLDER_TYPE_LABELS[type]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating...
                    </>
                ) : (
                    'Create Folder'
                )}
            </Button>
        </form>
    );
};
export { FolderCreationForm };