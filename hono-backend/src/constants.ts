export const WORK_DIR_NAME = "project";
export const WORK_DIR = `/home/${WORK_DIR_NAME}`;
export const MODIFICATIONS_TAG_NAME = "bolt_file_modifications";

export const VALID_TECHNOLOGIES = ["react", "node", "next"] as const;
export type TechnologyType = (typeof VALID_TECHNOLOGIES)[number];

export const AI_MODEL = "vansh";
export const TEMPLATE_SYSTEM_PROMPT =
  "Based on the context of this project, return exactly one of the following technologies in lowercase: 'react', 'node', or 'next'. Your response should consist of only this single word, without any additional text, punctuation, or explanation. DO NOT include any additional information or context.";
export const allowedHTMLElements = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "dd",
  "del",
  "details",
  "div",
  "dl",
  "dt",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "ins",
  "kbd",
  "li",
  "ol",
  "p",
  "pre",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "source",
  "span",
  "strike",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
  "var",
];

export function stripIndents(value: string): string;
export function stripIndents(
  strings: TemplateStringsArray,
  ...values: any[]
): string;
export function stripIndents(
  arg0: string | TemplateStringsArray,
  ...values: any[]
) {
  if (typeof arg0 !== "string") {
    const processedString = arg0.reduce((acc, curr, i) => {
      acc += curr + (values[i] ?? "");
      return acc;
    }, "");

    return _stripIndents(processedString);
  }

  return _stripIndents(arg0);
}

function _stripIndents(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trimStart()
    .replace(/[\r\n]$/, "");
}
