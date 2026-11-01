export const inputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["count", "focus", "fairness", "blocked"],
  properties: {
    count: { type: "integer", minimum: 2, maximum: 6 },
    focus: { type: "string", enum: ["design", "code", "motion", "research"] },
    fairness: { type: "boolean" },
    blocked: {
      type: "array",
      maxItems: 36,
      uniqueItems: true,
      items: { type: "string", pattern: "^l[1-6]:r[1-6]$" },
    },
  },
};
