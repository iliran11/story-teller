require("dotenv").config();
const fns = require("./functions");
const getTopic = require("./getTopic");

async function chatWithGPT(messages, sequence = 1) {
  if (sequence === 4) {
    console.log("[System] - DONE");
    return;
  }
  const { answer } = await fns.callOpenAi({ messages });
  console.log(
    `[Bot][Answer] - Sequence: ${sequence}, Title: ${answer.chapterTitle}`
  );
  fns.rendermarkdown(`## ${answer.chapterTitle}`);
  fns.rendermarkdown(answer.chapterContent);
  messages.push(fns.createMessage("assistant", answer));
  messages.push(fns.createMessage("user", "continue"));
  chatWithGPT(messages, sequence + 1);
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
