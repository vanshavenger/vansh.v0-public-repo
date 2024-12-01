import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { z } from "@hono/zod-openapi";
import ollama from "ollama";
import { basePrompts } from "./templates";
import { BASE_PROMPT } from "./prompts";
import { isValidTechnology, promptMaker } from "./utils";
import { AI_MODEL, TEMPLATE_SYSTEM_PROMPT } from "./constants";

const app = new Hono();

app.use("*", cors());
app.use("*", logger());

const promptSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

app.post("/template", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = promptSchema.parse(body);

    const response = await ollama.generate({
      model: AI_MODEL,
      prompt: prompt,
      system: TEMPLATE_SYSTEM_PROMPT,
    });

    const answer = response.response.trim().toLowerCase();

    if (isValidTechnology(answer)) {
      switch (answer) {
        case "react":
          return c.json({
            prompts: [BASE_PROMPT, promptMaker(basePrompts.react)],
            uiPrompts: [basePrompts.react],
          });
        case "node":
          return c.json({
            prompts: [promptMaker(basePrompts.node)],
            uiPrompts: [basePrompts.node],
          });

        case "next":
          return c.json({
            prompts: [BASE_PROMPT, promptMaker(basePrompts.next)],
            uiPrompts: [basePrompts.next],
          });
        default:
          console.warn(`Unexpected response from Ollama: ${answer}`);
          return c.json({ error: "Unexpected response from AI model" }, 422);
      }
    } else {
      console.warn(`Unexpected response from Ollama: ${answer}`);
      return c.json({ error: "Unexpected response from AI model" }, 422);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error("Error processing request:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});



app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

app.onError((err, c) => {
  console.error(`Unhandled error: ${err}`);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
