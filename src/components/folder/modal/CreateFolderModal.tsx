import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import {CreateFolderData} from "@/model/schema";
import {FolderType} from "@/lib/constans";

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateFolderData) => Promise<void>;
    allowedTypes: readonly FolderType[];
    parentType: string;
    isLoading: boolean;
}

const FolderCreationModal: React.FC<CreateFolderModalProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   onSubmit,
                                                                   allowedTypes = [],
                                                                   parentType,
                                                                   isLoading
                                                               }) => {
    const [folderName, setFolderName] = useState('');
    const [folderType, setFolderType] = useState(allowedTypes[0] || '');
    const [teamId, setTeamId] = useState('');

    const needsTeamId = ['equipo', 'tema'].includes(folderType);

    useEffect(() => {
        setFolderType(allowedTypes[0] || '');
    }, [allowedTypes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!folderName.trim()) return;

        await onSubmit({
            name: folderName,
            type: folderType,
            teamId: needsTeamId ? teamId : undefined
        });

        // Reset form
        setFolderName('');
        setFolderType(allowedTypes[0] || '');
        setTeamId('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New {parentType} Subfolder</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Folder Name</Label>
                        <Input
                            id="name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Enter folder name"
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Folder Type</Label>
                        <Select
                            value={folderType}
                            onValueChange={(value: FolderType) => {
                                console.log('Selected folder type:', value);
                                setFolderType(value);
                            }}
                        >
                            <SelectTrigger id="type" className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedTypes.map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {needsTeamId && (
                        <div className="space-y-2">
                            <Label htmlFor="teamId">Team ID</Label>
                            <Input
                                id="teamId"
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                                placeholder="Enter team ID"
                                className="w-full"
                            />
                        </div>
                    )}

                    <DialogFooter className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!folderName.trim() || isLoading}
                            className="min-w-[100px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FolderCreationModal;