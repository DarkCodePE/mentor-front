interface LoadingAnalysisProps {
    title?: string;
}

const LoadingAnalysis = ({ title = "Loading analysis..." }: LoadingAnalysisProps) => {
    return (
        <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-16 h-16">
                    {/* Anillo exterior */}
                    <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                    {/* Anillo de progreso animado */}
                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                    {/* Círculo central */}
                    <div className="absolute inset-2 bg-white rounded-full shadow-sm" />
                    {/* Icono central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-indigo-500 rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-indigo-500 rounded-full animate-[slide_1s_ease-in-out_infinite]" />
                        </div>
                        <p className="text-sm text-gray-500">Please wait while we prepare your analysis</p>
                    </div>
                </div>

                {/* Puntos de carga animados */}
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                            style={{
                                animationDelay: `${i * 0.2}s`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingAnalysis;