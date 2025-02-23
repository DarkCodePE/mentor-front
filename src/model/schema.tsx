// Loading states interface
interface LoadingStates {
    [key: string]: boolean;
}

// Types
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
    processed: boolean;
}

interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: any;
    critical_evaluation: any;
    mentor_report: any;
    metadata: any;
}