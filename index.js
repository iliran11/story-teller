require("dotenv").config();
const fns = require("./functions");
const getTopic = require("./getTopic");
const _ = require("lodash");

async function chatWithGPT(messages, sequence = 1, slug) {
  if (sequence === 4) {
    console.log("[System] - DONE");
    return;
  }
  const { answer } = await fns.callOpenAi({ messages });
  console.log(
    `[Bot][Answer] - Sequence: ${sequence}, Title: ${answer.chapterTitle}`
  );
  fns.write(`## ${answer.chapterTitle}`, slug);
  fns.write(answer.chapterContent, slug);
  messages.push(fns.createMessage("assistant", answer));
  messages.push(fns.createMessage("user", "continue"));
  chatWithGPT(messages, sequence + 1, slug);
}

const run = async () => {
  const messages = [];
  const topic = await getTopic();
  const slug = _.kebabCase(topic);
  messages.push(
    fns.createMessage("system", fns.instruction.getStoryTelling(topic))
  );

  await chatWithGPT(messages, 1, slug);
};

run();
