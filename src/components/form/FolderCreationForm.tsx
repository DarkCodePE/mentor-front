import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {ALLOWED_CHILD_TYPES, FOLDER_TYPE_LABELS, FolderType} from "@/lib/constans";
import {useFolderRulesStore} from "@/store/folderRulesStore";
import {Loader2} from "lucide-react";


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
    const rules = useFolderRulesStore((state) => state.rules);
    const currentRules = useFolderRulesStore((state) => state.getCurrentRules());

    const allowedTypes = parentType ? ALLOWED_CHILD_TYPES[parentType] : ALLOWED_CHILD_TYPES['root'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim() || !folderType) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Solo enviar teamId si es requerido para este nivel
        const currentRule = rules[folderType];
        if (currentRule.requiresTeamId && !teamId.trim()) {
            toast.error('Team ID is required for this folder type');
            return;
        }

        onSubmit(folderName, folderType, currentRule.requiresTeamId ? teamId : '');
        setFolderName('');
        setFolderType('');
        setTeamId('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-4">
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
                    {currentRules.allowedTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                            {FOLDER_TYPE_LABELS[type as FolderType]}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {rules[folderType as FolderType]?.requiresTeamId && (
                <Input
                    placeholder="Team ID"
                    value={teamId}
                    onChange={(e) => setTeamId(e.target.value)}
                    className="w-32"
                />
            )}

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