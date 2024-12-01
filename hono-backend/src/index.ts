import { Hono } from "hono";
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from '@hono/zod-openapi'
import ollama from "ollama";
import { basePrompts } from "./templates";

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

const promptSchema = z.object({
  prompt: z.string().min(1).max(1000),
});

type TechnologyType = 'react' | 'node' | 'next';

const isValidTechnology = (tech: string): tech is TechnologyType => {
  return ['react', 'node', 'next'].includes(tech.toLowerCase());
};

app.post("/template", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt } = promptSchema.parse(body);

    const response = await ollama.generate({
      model: "qwen2.5-coder:14b",
      prompt: prompt,
      system: "Based on the context of this project, return exactly one of the following technologies in lowercase: 'react', 'node', or 'next'. Your response should consist of only this single word, without any additional text, punctuation, or explanation. DO NOT include any additional information or context.",
    });

    const answer = response.response.trim().toLowerCase();

    if (isValidTechnology(answer)) {
      return c.json({ response: answer });
    } else {
      console.warn(`Unexpected response from Ollama: ${answer}`);
      return c.json({ error: "Unexpected response from AI model" }, 422);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: "Invalid input", details: error.errors }, 400);
    }
    console.error('Error processing request:', error);
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

