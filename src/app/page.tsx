
// src/app/page.tsx
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import TeamTaskAnalyzer from "@/components/AnalysisResult";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import FolderManager from "@/components/FolderManager";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <Tabs defaultValue="repository" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="repository">Document Repository</TabsTrigger>
                        <TabsTrigger value="external">Analyze External Document</TabsTrigger>
                    </TabsList>

                    <TabsContent value="repository" className="space-y-6">
                        <FolderManager />
                    </TabsContent>

                    <TabsContent value="external">
                        <DocumentAnalyzer />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}