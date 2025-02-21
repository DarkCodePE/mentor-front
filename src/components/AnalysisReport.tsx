'use client';
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircleIcon, InfoIcon, AlertTriangleIcon, HelpCircleIcon } from 'lucide-react';

interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: any;
    critical_evaluation: any;
    mentor_report: any;
    metadata: any;
}

interface EvaluationCriteria {
    score_interview: number;
    positives: string[];
    improvements: string[];
    recommendations: string[];
}

interface CriteriaEvaluation {
    clarity: EvaluationCriteria;
    audience: EvaluationCriteria;
    structure: EvaluationCriteria;
    depth: EvaluationCriteria;
    questions: EvaluationCriteria;
    final_score: number;
    general_recommendations: string[];
    suggested_questions: Record<string, string[]>;
}

interface CriticalEvaluationDetails {
    team_id: string;
    specificity_of_improvements: boolean;
    identified_improvement_opportunities: boolean;
    reflective_quality_scores: boolean;
    notes: string;
}

interface MentorReportDetails {
    executive_summary: string;
    key_findings: string[];
    discussion_points: Record<string, string>[];
    recommended_questions: string[];
    next_steps: Record<string, string>[];
    alerts: Record<string, string>[];
}

interface AnalysisDetails {
    validated_insights: Record<string, string>[];
    pending_hypotheses: Record<string, string>[];
    identified_gaps: string[];
    action_items: Record<string, string>[];
    mentor_details: MentorReportDetails;
}

function AnalysisReport(props: { result: AnalysisResult }) {
    const { result } = props;
    if (!result) return <p>No analysis result to display.</p>;

    const initialEval = result.initial_evaluation as CriteriaEvaluation;
    const criticalEval = result.critical_evaluation as CriticalEvaluationDetails;
    const mentorReport = result.mentor_report as AnalysisDetails;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Initial Evaluation</CardTitle>
                    <CardDescription>Criterios base de evaluación de la entrevista</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p><strong>Puntuación Final:</strong> {initialEval.final_score}</p>
                    <Accordion type="single" collapsible>
                        {['clarity', 'audience', 'structure', 'depth', 'questions'].map((criteriaName) => {
                            const criteria = initialEval[criteriaName as keyof CriteriaEvaluation] as EvaluationCriteria;
                            return criteria ? (
                                <AccordionItem key={criteriaName} value={criteriaName}>
                                    <AccordionTrigger>{criteriaName.charAt(0).toUpperCase() + criteriaName.slice(1)}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <p><strong>Puntuación:</strong> {criteria.score_interview}/10</p>
                                            <ul className="list-disc ml-4">
                                                <li className="flex items-center">
                                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                                    <strong>Positivos:</strong>
                                                </li>
                                                <ul className="list-disc ml-8">
                                                    {criteria.positives.map((item, index) => <li key={index}>{item}</li>)}
                                                </ul>
                                                <li className="flex items-center">
                                                    <AlertTriangleIcon className="h-4 w-4 text-yellow-500 mr-2" />
                                                    <strong>Mejoras:</strong>
                                                </li>
                                                <ul className="list-disc ml-8">
                                                    {criteria.improvements.map((item, index) => <li key={index}>{item}</li>)}
                                                </ul>
                                                <li className="flex items-center">
                                                    <HelpCircleIcon className="h-4 w-4 text-blue-500 mr-2" />
                                                    <strong>Recomendaciones:</strong>
                                                </li>
                                                <ul className="list-disc ml-8">
                                                    {criteria.recommendations.map((item, index) => <li key={index}>{item}</li>)}
                                                </ul>
                                            </ul>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ) : null;
                        })}
                        <AccordionItem value="generalRecommendations">
                            <AccordionTrigger>Recomendaciones Generales</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc ml-4">
                                    {initialEval.general_recommendations.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="suggestedQuestions">
                            <AccordionTrigger>Preguntas Sugeridas</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc ml-4">
                                    {Object.entries(initialEval.suggested_questions).map(([questionType, questions]) => (
                                        <div key={questionType} className="mb-2">
                                            <li className="flex items-center">
                                                <InfoIcon className="h-4 w-4 text-gray-500 mr-2" />
                                                <strong>{questionType}:</strong>
                                            </li>
                                            <ul className="list-decimal ml-8">
                                                {questions.map((q, index) => <li key={index}>{q}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Critical Evaluation</CardTitle>
                    <CardDescription>Evaluación crítica de la entrevista</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Team ID:</strong> {criticalEval.team_id}</p>
                    <p><strong>Especificidad de Mejoras:</strong> {criticalEval.specificity_of_improvements ? 'Sí' : 'No'}</p>
                    <p><strong>Oportunidades de Mejora Identificadas:</strong> {criticalEval.identified_improvement_opportunities ? 'Sí' : 'No'}</p>
                    <p><strong>Calidad Reflectiva de Puntuaciones:</strong> {criticalEval.reflective_quality_scores ? 'Sí' : 'No'}</p>
                    <p><strong>Notas:</strong> {criticalEval.notes}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Mentor Report</CardTitle>
                    <CardDescription>Reporte detallado del mentor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p><strong>Resumen Ejecutivo:</strong> {mentorReport.mentor_details?.executive_summary}</p>
                    <div>
                        <p><strong>Hallazgos Clave:</strong></p>
                        <ul className="list-disc ml-4">
                            {mentorReport.mentor_details?.key_findings?.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}