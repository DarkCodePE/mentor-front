import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {CheckCircle, Info, AlertTriangle, HelpCircle, AlertCircle, CheckCircleIcon} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

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
    suggested_questions: Record<string, string>;
}

function AnalysisReport(props: { result: AnalysisResult }) {
    const { result } = props;
    if (!result) return <div className="p-4 text-center text-gray-500">No hay resultados para mostrar.</div>;

    const initialEval = result.initial_evaluation as CriteriaEvaluation;
    const criticalEval = result.critical_evaluation;
    const mentorReport = result.mentor_report;

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-50';
        if (score >= 6) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Initial Evaluation Section */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-blue-900">Evaluación Inicial</CardTitle>
                            <CardDescription className="text-blue-700 mt-1">
                                Análisis detallado de criterios de evaluación
                            </CardDescription>
                        </div>
                        <Badge className={`text-lg px-4 py-2 ${getScoreColor(initialEval.final_score)}`}>
                            {initialEval.final_score}/10
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Accordion type="single" collapsible className="space-y-2">
                        {['clarity', 'audience', 'structure', 'depth', 'questions'].map((criteriaName) => {
                            const criteria = initialEval[criteriaName as keyof CriteriaEvaluation] as EvaluationCriteria;
                            if (!criteria) return null;

                            return (
                                <AccordionItem
                                    key={criteriaName}
                                    value={criteriaName}
                                    className="border rounded-lg px-4 hover:bg-gray-50 transition-colors"
                                >
                                    <AccordionTrigger className="py-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-lg capitalize">
                                                {criteriaName}
                                            </span>
                                            <Badge className={`${getScoreColor(criteria.score_interview)}`}>
                                                {criteria.score_interview}/10
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <div className="space-y-4 pt-2">
                                            {/* Positives Section */}
                                            <div className="bg-green-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                                    <h4 className="font-semibold text-green-900">Aspectos Positivos</h4>
                                                </div>
                                                <ul className="space-y-2 ml-7">
                                                    {criteria.positives.map((item, index) => (
                                                        <li key={index} className="text-green-800">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Improvements Section */}
                                            <div className="bg-yellow-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                                    <h4 className="font-semibold text-yellow-900">Áreas de Mejora</h4>
                                                </div>
                                                <ul className="space-y-2 ml-7">
                                                    {criteria.improvements.map((item, index) => (
                                                        <li key={index} className="text-yellow-800">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Recommendations Section */}
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <HelpCircle className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-semibold text-blue-900">Recomendaciones</h4>
                                                </div>
                                                <ul className="space-y-2 ml-7">
                                                    {criteria.recommendations.map((item, index) => (
                                                        <li key={index} className="text-blue-800">{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Critical Evaluation Section */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                    <CardTitle className="text-2xl text-purple-900">Evaluación Crítica</CardTitle>
                    <CardDescription className="text-purple-700">
                        Análisis profundo y evaluación detallada
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold">Team ID:</span>
                                <span>{criticalEval.team_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className={`h-5 w-5 ${criticalEval.specificity_of_improvements ? 'text-green-600' : 'text-red-600'}`} />
                                <span className="font-semibold">Especificidad de Mejoras:</span>
                                <span>{criticalEval.specificity_of_improvements ? 'Sí' : 'No'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircleIcon className={`h-5 w-5 ${criticalEval.identified_improvement_opportunities ? 'text-green-600' : 'text-red-600'}`} />
                                <span className="font-semibold">Oportunidades Identificadas:</span>
                                <span>{criticalEval.identified_improvement_opportunities ? 'Sí' : 'No'}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Notas Adicionales:</h4>
                            <p className="text-gray-700">{criticalEval.notes}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mentor Report Section */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                    <CardTitle className="text-2xl text-teal-900">Reporte del Mentor</CardTitle>
                    <CardDescription className="text-teal-700">
                        Resumen ejecutivo y puntos clave
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {mentorReport.validated_insights?.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h4 className="font-semibold text-lg mb-3 text-teal-900">Insights Validados</h4>
                            <ul className="space-y-2">
                                {mentorReport.validated_insights.map((item: any, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-1" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {mentorReport.action_items?.length > 0 && (
                        <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <h4 className="font-semibold text-lg mb-3 text-teal-900">Acciones Recomendadas</h4>
                            <ul className="space-y-3">
                                {mentorReport.action_items.map((item: any, index: number) => (
                                    <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{item.recommendation}</span>
                                        <Badge className={item.priority === 'alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                                            {item.priority}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default AnalysisReport;