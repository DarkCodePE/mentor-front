// stores/folderRulesStore.ts
import { create } from 'zustand'
import {FOLDER_HIERARCHY, FolderType} from "@/lib/constans";

interface FolderRule {
    parentType: FolderType | null;
    allowedTypes: readonly FolderType[]; // Make this readonly
    requiresTeamId: boolean;
}

interface FolderRulesState {
    rules: Record<FolderType | 'root', FolderRule>;
    currentLevel: FolderType | 'root';
    setCurrentLevel: (level: FolderType | 'root') => void;
    getCurrentRules: () => FolderRule;
}


export const useFolderRulesStore = create<FolderRulesState>((set, get) => ({
    rules: {
        root: {
            parentType: null,
            allowedTypes: FOLDER_HIERARCHY.root,
            requiresTeamId: false
        },
        project: {
            parentType: 'project',
            allowedTypes: FOLDER_HIERARCHY.project,
            requiresTeamId: false
        },
        avances: {
            parentType: 'project',
            allowedTypes: FOLDER_HIERARCHY.avances,
            requiresTeamId: false
        },
        sesiones: {
            parentType: 'project',
            allowedTypes: FOLDER_HIERARCHY.sesiones,
            requiresTeamId: false
        },
        equipo: {
            parentType: 'avances',
            allowedTypes: FOLDER_HIERARCHY.equipo,
            requiresTeamId: true
        },
        tema: {
            parentType: 'sesiones',
            allowedTypes: FOLDER_HIERARCHY.tema,
            requiresTeamId: true
        }
    },
    currentLevel: 'root',
    setCurrentLevel: (level) => set({ currentLevel: level }),
    getCurrentRules: () => get().rules[get().currentLevel]
}));