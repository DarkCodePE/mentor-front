// Types for folder hierarchy
export type FolderType = 'project' | 'avances' | 'sesiones' | 'equipo' | 'tema';

export const FOLDER_TYPE_LABELS: Record<FolderType, string> = {
    project: 'Project',
    avances: 'Avances',
    sesiones: 'Sesiones',
    equipo: 'Equipo',
    tema: 'Tema'
};

type AllowedChildTypesMap = {
    root: FolderType[];
    project: FolderType[];
    avances: FolderType[];
    sesiones: FolderType[];
    equipo: FolderType[];
    tema: FolderType[];
};

export const ALLOWED_CHILD_TYPES: AllowedChildTypesMap = {
    root: ['project'],
    project: ['avances', 'sesiones'],
    avances: ['equipo'],
    sesiones: ['tema'],
    equipo: [],
    tema: []
} as const;

// Folder hierarchy definition
export const FOLDER_HIERARCHY: Record<FolderType | 'root', readonly FolderType[]> = {
    'root': ['project'] as const,
    'project': ['avances', 'sesiones'] as const,
    'avances': ['equipo'] as const,
    'sesiones': ['tema'] as const,
    'equipo': [] as const,
    'tema': [] as const
} as const;
