import {ChevronDown, ChevronRight, FolderPlus, Loader2, RefreshCw, Upload} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const FolderHeader = ({
                          folder,
                          isExpanded,
                          onToggle,
                          onUpload,
                          onSync,
                          isSyncing,
                          loadingStates
                      }: {
    folder: FolderData;
    isExpanded: boolean;
    onToggle: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSync: () => void;
    isSyncing: boolean;
    loadingStates: LoadingStates;
}) => (
    <div
        className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2"
        onClick={onToggle}
    >
        {/* Control de expansión */}
        {folder.children.length > 0 ? (
            isExpanded ?
                <ChevronDown className="w-4 h-4 text-gray-500" /> :
                <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
            <div className="w-4" />
        )}

        {/* Información de la carpeta */}
        <FolderPlus className="w-5 h-5 text-indigo-500" />
        <span className="text-gray-700 font-medium">{folder.name}</span>
        <span className="text-gray-400 text-sm ml-2">
            ({folder.documents.length} files)
        </span>

        {/* Botones de acción */}
        <div className="flex gap-2 ml-auto" onClick={e => e.stopPropagation()}>
            {/* Botón de sincronización de carpeta */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onSync()}
                disabled={isSyncing}
            >
                <RefreshCw className={cn(
                    "w-4 h-4 mr-2",
                    isSyncing && "animate-spin"
                )} />
                {isSyncing ? 'Syncing...' : 'Sync Folder'}
            </Button>

            {/* Botón de subida de archivos */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e) => onUpload(e as any);
                    input.click();
                }}
                disabled={loadingStates[`upload-${folder.id}`]}
            >
                {loadingStates[`upload-${folder.id}`] ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                    </>
                )}
            </Button>
        </div>
    </div>
);
export {FolderHeader};