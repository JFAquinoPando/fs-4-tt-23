const ALLOWED_VALUES = {
    audience: new Set(["primaria", "secundaria", "universidad", "general"]),
    difficulty: new Set(["basico", "intermedio", "avanzado"]),
    format: new Set(["mixto", "opcion_multiple", "respuesta_abierta"])
};

function cleanText(value, maxLength) {
    return String(value ?? "").trim().slice(0, maxLength);
}

export function buildQuestionRequest(values) {
    const count = Number.parseInt(values.count, 10);

    return {
        topic: cleanText(values.topic, 120),
        audience: ALLOWED_VALUES.audience.has(values.audience) ? values.audience : "general",
        difficulty: ALLOWED_VALUES.difficulty.has(values.difficulty) ? values.difficulty : "intermedio",
        format: ALLOWED_VALUES.format.has(values.format) ? values.format : "mixto",
        count: Number.isFinite(count) ? Math.min(10, Math.max(1, count)) : 5,
        context: cleanText(values.context, 400)
    };
}

function makeQuestion(payload, index) {
    const isMultipleChoice = payload.format === "opcion_multiple"
        || (payload.format === "mixto" && index % 2 === 0);
    const id = `q_${String(index + 1).padStart(2, "0")}`;
    const focus = payload.context ? ` Considera también este enfoque: ${payload.context}.` : "";
    const prompts = [
        `¿Cuál es una idea clave para comprender ${payload.topic}?`,
        `¿Qué relación importante existe dentro de ${payload.topic}?`,
        `¿Qué evidencia ayudaría a explicar un fenómeno de ${payload.topic}?`,
        `¿Cómo aplicarías un concepto de ${payload.topic} a un caso real?`,
        `¿Qué conclusión razonable se puede obtener al estudiar ${payload.topic}?`
    ];
    const base = {
        id,
        type: isMultipleChoice ? "opcion_multiple" : "respuesta_abierta",
        prompt: `${prompts[index % prompts.length]}${focus}`,
        rationale: `La respuesta debe demostrar comprensión ${payload.difficulty} del tema para ${payload.audience}.`
    };

    if (isMultipleChoice) {
        return {
            ...base,
            options: [
                `Una explicación basada en conceptos de ${payload.topic}`,
                "Una afirmación sin evidencia ni relación con el tema",
                "Una conclusión que contradice los datos disponibles",
                "Un ejemplo que no corresponde al contexto planteado"
            ],
        correct_answer: `Una explicación basada en conceptos de ${payload.topic}`
        };
    }

    return {
        ...base,
        rubric_answer: `La respuesta explica una idea de ${payload.topic} y la justifica con un ejemplo o evidencia pertinente.`,
        correct_answer: null
    };
}

export function createDemoResponse(payload) {
    return {
        request_id: `demo_${Date.now().toString(36)}`,
        model: "demo-navis-1",
        generated_at: new Date().toISOString(),
        questions: Array.from({ length: payload.count }, (_, index) => makeQuestion(payload, index))
    };
}

export async function requestQuestions(payload, fetchImpl = globalThis.fetch) {
    try {
        if (typeof fetchImpl !== "function") throw new Error("fetch no está disponible");

        const response = await fetchImpl("/api/v1/questions/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`El endpoint respondió ${response.status}`);
        const result = await response.json();
        if (!result || !Array.isArray(result.questions)) {
            throw new Error("La respuesta no cumple el contrato esperado");
        }

        return { ...result, source: "api" };
    } catch (error) {
        return {
            ...createDemoResponse(payload),
            source: "demo",
            fallbackReason: error instanceof Error ? error.message : "No se pudo conectar con el endpoint"
        };
    }
}
