import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle, HelpCircle, AlertCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Tipos
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

interface AnalysisResult {
    team_id: string;
    interview_content: string;
    initial_evaluation: CriteriaEvaluation;
    critical_evaluation: {
        team_id: string;
        specificity_of_improvements: boolean;
        identified_improvement_opportunities: boolean;
        reflective_quality_scores: boolean;
        notes: string;
    };
    mentor_report: {
        validated_insights: Array<{insight: string}>;
        action_items: Array<{recommendation: string; priority: string}>;
    };
    metadata: any;
}

// Componentes internos
const CriteriaSection = ({
                             criteriaName,
                             criteria
                         }: {
    criteriaName: string;
    criteria: EvaluationCriteria;
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-600 bg-green-50';
        if (score >= 6) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <AccordionItem
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
                    {/* Positives */}
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

                    {/* Improvements */}
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

                    {/* Recommendations */}
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
};

const MentorInsights = ({ insights }: { insights: Array<{insight: string}> }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h4 className="font-semibold text-lg mb-3 text-teal-900">Insights Validados</h4>
        <ul className="space-y-2">
            {insights.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 mt-1" />
                    <span className="text-gray-700">{item.insight}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ActionItems = ({
                         items
                     }: {
    items: Array<{recommendation: string; priority: string}>
}) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h4 className="font-semibold text-lg mb-3 text-teal-900">Acciones Recomendadas</h4>
        <ul className="space-y-3">
            {items.map((item, index) => (
                <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{item.recommendation}</span>
                    <Badge className={item.priority === 'alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {item.priority}
                    </Badge>
                </li>
            ))}
        </ul>
    </div>
);

// Componente principal
const AnalysisReport = ({ result }: { result: AnalysisResult }) => {
    if (!result?.initial_evaluation) {
        return (
            <Card className="p-6">
                <CardContent>
                    <div className="text-center text-gray-500">
                        No hay resultados disponibles para mostrar.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Initial Evaluation */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl text-blue-900">Evaluación Inicial</CardTitle>
                            <CardDescription className="text-blue-700 mt-1">
                                Análisis detallado de criterios de evaluación
                            </CardDescription>
                        </div>
                        <Badge
                            className={`text-lg px-4 py-2 ${
                                result.initial_evaluation.final_score >= 8
                                    ? 'text-green-600 bg-green-50'
                                    : result.initial_evaluation.final_score >= 6
                                        ? 'text-yellow-600 bg-yellow-50'
                                        : 'text-red-600 bg-red-50'
                            }`}
                        >
                            {result.initial_evaluation.final_score}/10
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Accordion type="single" collapsible className="space-y-2">
                        {(['clarity', 'audience', 'structure', 'depth', 'questions'] as const).map((criteriaName) => (
                            <CriteriaSection
                                key={criteriaName}
                                criteriaName={criteriaName}
                                criteria={result.initial_evaluation[criteriaName]}
                            />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>

            {/* Critical Evaluation */}
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
                                <span>{result.critical_evaluation.team_id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle
                                    className={`h-5 w-5 ${
                                        result.critical_evaluation.specificity_of_improvements
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                />
                                <span className="font-semibold">Especificidad de Mejoras:</span>
                                <span>{result.critical_evaluation.specificity_of_improvements ? 'Sí' : 'No'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle
                                    className={`h-5 w-5 ${
                                        result.critical_evaluation.identified_improvement_opportunities
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                />
                                <span className="font-semibold">Oportunidades Identificadas:</span>
                                <span>
                  {result.critical_evaluation.identified_improvement_opportunities ? 'Sí' : 'No'}
                </span>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold mb-2">Notas Adicionales:</h4>
                            <p className="text-gray-700">{result.critical_evaluation.notes}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Mentor Report */}
            <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 border-b">
                    <CardTitle className="text-2xl text-teal-900">Reporte del Mentor</CardTitle>
                    <CardDescription className="text-teal-700">
                        Resumen ejecutivo y puntos clave
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    {result.mentor_report.validated_insights?.length > 0 && (
                        <MentorInsights insights={result.mentor_report.validated_insights} />
                    )}
                    {result.mentor_report.action_items?.length > 0 && (
                        <ActionItems items={result.mentor_report.action_items} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalysisReport;