require("dotenv").config();
const fns = require("./functions");

const suggestionMessages = [fns.createMessage("user", fns.getSuggestion())];
const messages = [];

async function chatWithGPT() {
  if (suggestionMessages.length < 2) {
    const { answer } = await fns.callOpenAi({
      messages: suggestionMessages,
      json: true,
    });
    suggestionMessages.push(fns.createMessage("assistant", answer.topic));
    if (!answer.topic) {
      throw new Error("Something is wrong with the subject provided by OpenAI");
    }
    console.log(`[Bot][Suggestion]: ${answer.topic}`);
    messages.push(
      fns.createMessage("system", fns.getInstructions(answer.topic))
    );
    fns.rendermarkdown(`# ${answer.topic}`);
    chatWithGPT();
  } else {
    const { answer } = await fns.callOpenAi({ messages });
    if (answer.chapterProgress === 4) {
      process.exit();
    }
    console.log(`[Bot][Answer] - Progess - ${answer.chapterProgress}`);
    fns.rendermarkdown(`## ${answer.chapterTitle}`);
    fns.rendermarkdown(answer.chapterContent);
    messages.push(fns.createMessage("assistant", answer));
    messages.push(fns.createMessage("user", "continue"));
    chatWithGPT();
  }
}

chatWithGPT();
