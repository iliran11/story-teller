const fs = require("fs");
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: apiKey, // This is the default and can be omitted
});

const nobreaklines = (str) => str.replace(/(\r\n|\n|\r)/gm, "");

const instruction = {
  getSuggestion: () => {
    const instruction = fs.readFileSync(
      "./instructions/suggestion.txt",
      "utf8"
    );
    return nobreaklines(instruction);
  },
  getStoryTelling: (topic) => {
    let instruction = fs.readFileSync(
      "./instructions/story-telling.txt",
      "utf8"
    );
    instruction = instruction.replace("${topic}", topic);
    return nobreaklines(instruction);
  },
  changeLanguage: () => {
    const instruction = fs.readFileSync(
      "./instructions/change-language.txt",
      "utf8"
    );
    return nobreaklines(instruction);
  },
};

const rendermarkdown = (str) => {
  fs.appendFileSync("./temp.md", `${str}\n`, "utf-8");
  return;
};

const createMessage = (role, content) => {
  const text = role === "user" ? content : JSON.stringify(content);
  return {
    role,
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
};

const callOpenAi = async ({ messages }) => {
  const res = await client.chat.completions.create({
    messages,
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });
  let answer = res.choices[0].message.content;
  answer = JSON.parse(answer);

  return {
    answer,
  };
};

module.exports = {
  instruction,
  createMessage,
  callOpenAi,
  rendermarkdown,
};
