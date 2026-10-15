import test from "node:test";
import assert from "node:assert/strict";
import { buildQuestionRequest, createDemoResponse, requestQuestions } from "./question-api.mjs";

test("builds the API request with normalized fields and a bounded question count", () => {
    const request = buildQuestionRequest({
        topic: "  Ecosistemas marinos ",
        audience: "secundaria",
        difficulty: "intermedio",
        format: "mixto",
        count: "99",
        context: "  Cadenas alimentarias  "
    });

    assert.deepEqual(request, {
        topic: "Ecosistemas marinos",
        audience: "secundaria",
        difficulty: "intermedio",
        format: "mixto",
        count: 10,
        context: "Cadenas alimentarias"
    });
});

test("creates a demo response with the requested number and question format", () => {
    const response = createDemoResponse({
        topic: "Corrientes oceánicas",
        audience: "universidad",
        difficulty: "avanzado",
        format: "opcion_multiple",
        count: 3,
        context: ""
    });

    assert.equal(response.questions.length, 3);
    assert.equal(response.questions[0].type, "opcion_multiple");
    assert.equal(response.questions[0].options.length, 4);
    assert.equal(typeof response.questions[0].correct_answer, "string");
    assert.equal(response.model, "demo-navis-1");
    assert.match(response.request_id, /^demo_/);
});

test("falls back to a compatible demo response if the API is unavailable", async () => {
    const result = await requestQuestions({ topic: "Mareas", audience: "general", difficulty: "basico", format: "mixto", count: 2, context: "" }, async () => {
        throw new Error("offline");
    });

    assert.equal(result.source, "demo");
    assert.equal(result.questions.length, 2);
    assert.match(result.fallbackReason, /offline/);
});
