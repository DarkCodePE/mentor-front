// Loading states interface
export interface LoadingStates {
    [key: string]: boolean;
}
export type FolderType = 'project' | 'avances' | 'sesiones' | 'equipo' | 'tema';
// Types
export interface FolderData {
    id: number;
    name: string;
    folder_type: FolderType;
    google_drive_folder_id: string;
    parent_id: number | null;
    team_id: string;
    children: FolderData[];
    documents: DocumentData[];
}

export interface DocumentData {
    id: number;
    name: string;
    mime_type: string;
    file_id: string;
    web_view_link?: string;
    processed: boolean;
}

export interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: any;
    critical_evaluation: any;
    mentor_report: any;
    metadata: any;
}

export interface CreateFolderData {
    name: string;
    type: FolderType;
    teamId?: string;
}
