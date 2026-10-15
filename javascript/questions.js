import { buildQuestionRequest, requestQuestions } from "./question-api.mjs";

const form = document.querySelector("#question-form");
const payloadPreview = document.querySelector("#payload-preview");
const questionList = document.querySelector("#question-list");
const resultCount = document.querySelector("#result-count");
const resultMeta = document.querySelector("#result-meta");
const generateButton = document.querySelector("#generate-button");
const connectionState = document.querySelector("#connection-state");

function readForm() {
    return buildQuestionRequest(Object.fromEntries(new FormData(form)));
}

function refreshRequestPreview() {
    payloadPreview.textContent = JSON.stringify(readForm(), null, 2);
}

function addText(parent, tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
}

function renderQuestion(question, index) {
    const card = document.createElement("article");
    card.className = "question-card";
    const topLine = document.createElement("div");
    topLine.className = "question-topline";
    addText(topLine, "span", "question-number", `PREGUNTA ${String(index + 1).padStart(2, "0")}`);
    addText(topLine, "span", "question-type", question.type === "opcion_multiple" ? "Opción múltiple" : "Respuesta abierta");
    card.append(topLine);
    addText(card, "p", "question-prompt", question.prompt);

    if (Array.isArray(question.options) && question.options.length) {
        const options = document.createElement("ul");
        options.className = "answer-options";
        question.options.forEach((option, optionIndex) => {
            const item = document.createElement("li");
            const letter = document.createElement("b");
            letter.textContent = `${String.fromCharCode(65 + optionIndex)}.`;
            item.append(letter, document.createTextNode(option));
            options.append(item);
        });
        card.append(options);
    }

    const details = document.createElement("details");
    details.className = "answer-details";
    const correctAnswer = question.correct_answer || question.correctAnswer;
    addText(details, "summary", "", correctAnswer ? "Ver respuesta y criterio" : "Ver criterio de evaluación");
    const answerText = correctAnswer || question.rubric_answer || question.rubricAnswer || "Respuesta abierta según los objetivos propuestos.";
    addText(details, "p", "", `${answerText} ${question.rationale || ""}`.trim());
    card.append(details);
    return card;
}

function renderResults(result) {
    questionList.replaceChildren();
    result.questions.forEach((question, index) => questionList.append(renderQuestion(question, index)));
    resultCount.textContent = String(result.questions.length);
    resultMeta.textContent = `${result.source === "api" ? "API conectada" : "Respuesta simulada"} · request_id: ${result.request_id || result.requestId || "—"} · model: ${result.model || "navis-question-1"}`;
    connectionState.textContent = result.source === "api" ? "API · conectada" : "API · modo demostración";
}

form.addEventListener("input", refreshRequestPreview);
form.addEventListener("change", refreshRequestPreview);

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const payload = readForm();
    payloadPreview.textContent = JSON.stringify(payload, null, 2);
    questionList.setAttribute("aria-busy", "true");
    questionList.innerHTML = "<div class=\"empty-state\"><span class=\"empty-icon\" aria-hidden=\"true\">…</span><strong>Consultando la API</strong><span>Preparando preguntas para tu misión.</span></div>";
    generateButton.disabled = true;
    generateButton.querySelector("span").textContent = "Generando…";

    try {
        const result = await requestQuestions(payload);
        renderResults(result);
    } finally {
        questionList.setAttribute("aria-busy", "false");
        generateButton.disabled = false;
        generateButton.querySelector("span").textContent = "Generar preguntas";
    }
});

document.querySelector("#clear-button").addEventListener("click", () => {
    questionList.innerHTML = "<div class=\"empty-state\"><span class=\"empty-icon\" aria-hidden=\"true\">⌖</span><strong>Sin preguntas todavía</strong><span>Configura los parámetros y envía tu primera misión.</span></div>";
    resultCount.textContent = "0";
    resultMeta.textContent = "Esperando una solicitud · request_id: —";
});

refreshRequestPreview();
