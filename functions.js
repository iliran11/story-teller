const fs = require("fs");
const OpenAI = require("openai");
const apiKey = process.env.OPENAI_API_KEY;
const client = new OpenAI({
  apiKey: apiKey, // This is the default and can be omitted
});

const getInstructions = (topic) => {
  const instructions = `* you will make a story out of this subject: ${topic}.
* You will tell your story in medium-sized chapters.
* Each chapter should belong to each response.
* in total the story has 3 chapters.
* Every time I write anything, you will continue to the next chapter.
* I have nothing to contribute to the conversation apart from reading your stories.
* all your human readable content, format as markdown. but not the inital suggestions mentioned before.
* You will tell your story in an easy-to-digest and entertaining way. Remember, it should be a story I read casually and enjoy.
* Make it extremely rare for one of your stories to repeat itself.
* Feel free to extract stories from my region or time of humankind.
* Prioritize great varienece with your story. First try to think of 100 random stories, then pick one randomly.
* When the story ends, just write "=STOP=="
`;
return instructions.replaceAll('\\n')
};

const getSuggestion = () => {
  return `
Choose a random topic that can make a great story. The topic should be an actual event that took place in the history.
like:
  * history about military battles interesting diplomatic standoffs
  * geopolitics from the present and past
  * create your own future predictions or illusions.
  Your input will be only the subject itself in a JSON format. the key should be "topic"
`;
return instruction.replaceAll('\n','')
};

const createMessage = (role, content) => {
  return {
    role,
    content: [
      {
        type: "text",
        text: content,
      },
    ],
  };
};

const callOpenAi = async ({ messages, json }) => {
  const res = await client.chat.completions.create({
    messages,
    model: "gpt-4o",
    response_format: { type: json ? "json_object" : "text" },
  });
  let answer = res.choices[0].message.content;
  if (json) {
    answer = JSON.parse(answer);
  }
  if (!json) {
    console.log(answer.substring(0, 50));
  }
  return {
    answer,
  };
};

const processMarkdown = (input) => {
  const formattedMarkdown = input.replace(/\\n/g, "\n");
  return formattedMarkdown;
};

const writeMarkdown = (input) => {
  fs.appendFileSync("./temp.md", input, "utf-8");
};

module.exports = {
  getInstructions,
  getSuggestion,
  createMessage,
  callOpenAi,
  processMarkdown,
  writeMarkdown,
};
