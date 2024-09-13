const fs = require("fs");
const markdownit = require("markdown-it");
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: apiKey, // This is the default and can be omitted
});
const md = markdownit();

const nobreaklines = (str) => str.replace(/(\r\n|\n|\r)/gm, "");

const getInstructions = (topic) => {
  const instructions = `you will make a story out of this subject: ${topic}.
 You will seperate your story to 3 chapters,
 then you will write an epilougue,
 Each chapter should be written in one message of yours,
 Every time I respond with "continue", you will write the next chapter in another message,
 You will tell your story in an easy-to-digest and entertaining way. Remember, it should be a story I read casually and enjoy,
 Feel free to extract stories from any region or time of humankind,
 You will respond with JSON format.
 Your response wil have 3 fields: chapterTitle of the chapter, chapterContent (do not include the title there again), and chapterProgress. for example: chapterProgress: 1/4,
 the 4/4 response will contain the epilouge, so will be its title
`;
  const result = nobreaklines(instructions);
  return result;
};

const getSuggestion = () => {
  const instruction = `
Choose a random topic that can make a great story. The topic should be an actual event that took place in the history.
like:
  history about military battles interesting diplomatic standoffs,
  geopolitics from the present and past,
  create your own future predictions or illusions,
  Your input will be only the subject itself in a JSON format. the key should be "topic"
`;
  const result = nobreaklines(instruction);
  return result;
};

const rendermarkdown = () => {};

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

const writeMarkdown = (input) => {
  fs.appendFileSync("./temp.md", input, "utf-8");
};

const navigator = (messages) => {};

module.exports = {
  getInstructions,
  getSuggestion,
  createMessage,
  callOpenAi,
  writeMarkdown,
  rendermarkdown,
};
