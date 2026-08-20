const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const summarizeTranscript = async (transcript) => {
  if (!transcript || !transcript.trim()) {
    throw new Error("Transcript is required for summarization.");
  }

  const prompt = `
You are an expert meeting analyst.

Analyze the following meeting transcript and return ONLY valid JSON.

The JSON must follow this exact structure:

{
  "summary": "A concise summary of the meeting",
  "keyTopics": [
    "topic 1",
    "topic 2"
  ],
  "keyDecisions": [
    "decision 1",
    "decision 2"
  ],
  "actionItems": [
    {
      "task": "Task that needs to be completed",
      "assignee": "Person responsible or null",
      "deadline": "Deadline or null",
      "priority": "LOW"
    }
  ]
}

Rules:

1. summary must be concise but informative.
2. keyTopics should contain the main subjects discussed.
3. keyDecisions should contain decisions actually made during the meeting.
4. actionItems should contain only actual tasks or follow-ups.
5. Do not invent information.
6. Use null when an assignee or deadline is not mentioned.
7. priority must be exactly one of:
   LOW, MEDIUM, HIGH.
8. Return ONLY JSON. Do not use Markdown code fences.

Meeting transcript:

${transcript}
`;

  const completion = await groq.chat.completions.create({
    model:
      process.env.GROQ_SUMMARIZATION_MODEL ||
      "openai/gpt-oss-20b",

    messages: [
      {
        role: "system",
        content:
          "You analyze meeting transcripts and return structured JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature: 0.2,
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "Empty response received from summarization model."
    );
  }

  let result;

  try {
    result = JSON.parse(content);
  } catch (error) {
    throw new Error(
      "Summarization model returned invalid JSON."
    );
  }

  return result;
};

module.exports = {
  summarizeTranscript,
};