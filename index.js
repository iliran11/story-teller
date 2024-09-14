require("dotenv").config();
const fns = require("./functions");

const getTopic = async () => {
  const suggestionMessages = [
    fns.createMessage("user", fns.instruction.getSuggestion()),
  ];
  const { answer } = await fns.callOpenAi({
    messages: suggestionMessages,
    json: true,
  });
  suggestionMessages.push(fns.createMessage("assistant", answer.topic));
  if (!answer.topic) {
    throw new Error("Something is wrong with the subject provided by OpenAI");
  }
  console.log(`[Bot][Suggestion]: ${answer.topic}`);
  return answer.topic;
};

async function chatWithGPT(messages) {
  const { answer } = await fns.callOpenAi({ messages });
  if (answer.chapterProgress === 4) {
    process.exit();
  }
  console.log(`[Bot][Answer] - Progess - ${answer.chapterProgress}`);
  fns.rendermarkdown(`## ${answer.chapterTitle}`);
  fns.rendermarkdown(answer.chapterContent);
  messages.push(fns.createMessage("assistant", answer));
  messages.push(fns.createMessage("user", "continue"));
  chatWithGPT(messages);
}

const run = async () => {
  const messages = [];
  const topic = await getTopic();
  messages.push(
    fns.createMessage("system", fns.instruction.getStoryTelling(topic))
  );
  await chatWithGPT(messages);
};

run();