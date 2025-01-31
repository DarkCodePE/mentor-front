
// src/app/page.tsx
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import TeamTaskAnalyzer from "@/components/AnalysisResult";

export default function Home() {
    return (
        <main>
            <TeamTaskAnalyzer />
        </main>
    );
}