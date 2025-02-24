
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {FolderPlus, Upload, File, ChevronRight, ChevronDown, Search, Loader2, RefreshCw} from 'lucide-react';
import {Badge} from "@/components/ui/badge";
import {AnalysisResult, DocumentData} from "@/model/schema";
// Sub-components
interface DocumentCardProps {
    doc: DocumentData;
    isAnalyzing: boolean;
    selectedDocument: DocumentData | null;
    analysisResult: AnalysisResult | null;
    onAnalyze: (doc: DocumentData) => void;
    onViewAnalysis: (doc: DocumentData) => void;
    showAnalysis: boolean;
    isLoadingAnalysis?: boolean;
}

const DocumentCard = ({
                          doc,
                          isAnalyzing,
                          selectedDocument,
                          analysisResult,
                          onAnalyze,
                          onViewAnalysis,
                          showAnalysis,
                          isLoadingAnalysis
                      }: DocumentCardProps) => {
    const isSelected = selectedDocument?.id === doc.id;

    return (
        <Card className="p-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <File className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{doc.name}</span>
                    {doc.processed && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                            Processed
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                    {doc.web_view_link && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.web_view_link, '_blank')}
                        >
                            View
                        </Button>
                    )}
                    {doc.processed ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewAnalysis(doc)}
                            disabled={isLoadingAnalysis}
                        >
                            {isLoadingAnalysis && isSelected ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Loading...
                                </>
                            ) : (
                                isSelected && showAnalysis ? 'Hide Analysis' : 'View Analysis'
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => onAnalyze(doc)}
                            disabled={isAnalyzing && isSelected}
                        >
                            {isAnalyzing && isSelected ? (
                                <>
                                    <Search className="w-4 h-4 animate-spin mr-2" />
                                    Analyzing...
                                </>
                            ) : (
                                'Analyze'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default DocumentCard;