import { basePrompt as NodeBasePrompt } from "./node";
import { basePrompt as ReactBasePrompt } from "./react";
import { basePrompt as NextBasePrompt } from "./next";

export const basePrompts = {
  node: NodeBasePrompt,
  react: ReactBasePrompt,
  next: NextBasePrompt,
};
