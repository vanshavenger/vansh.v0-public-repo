import { TechnologyType } from "./constants";

export const promptMaker = (basePrompt: string) => {
  return `Here is the artifact that contains all files of the project visible to you. \nConsider the contents of ALL files in the project.\n\n${basePrompt} \n\n Here is a list of files that exist on the file system but are not being show to you:\n\n - .gitignore\n - package-lock.json\n - .bolt/prompt`;
};

export const isValidTechnology = (tech: string): tech is TechnologyType => {
  return ["react", "node", "next"].includes(tech.toLowerCase());
};

export function convertMessageFormat(originalMessages: { role: string; content: string }[]) : { parsedMessages: { role: string; parts: { text: string }[] }[], userPrompt: string } {
  if (originalMessages.length === 0) {
    return { parsedMessages: [], userPrompt: '' };
  }

  const historyMessages = originalMessages.slice(0, -1).map(message => ({
    role: message.role,
    parts: [{ text: message.content }]
  }));

  const lastMessage = originalMessages[originalMessages.length - 1];
  const prompt = lastMessage ? lastMessage.content : '';

  return {
    parsedMessages: historyMessages,
    userPrompt: prompt
  };
}
