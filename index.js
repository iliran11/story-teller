require("dotenv").config();
const fns = require("./functions");
const getTopic = require("./getTopic");

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
