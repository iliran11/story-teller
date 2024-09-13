require('dotenv').config()
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
    messages.push(
      fns.createMessage("system", fns.getInstructions(answer.topic))
    );
    chatWithGPT();
  } else {
    const { answer } = await fns.callOpenAi({ messages });
    fns.writeMarkdown(fns.processMarkdown(answer));
    messages.push(fns.createMessage("assistant", answer));
    messages.push(fns.createMessage("user", "continue"));
    console.log(ansewr.substring(0,50));
    chatWithGPT();
  }
}

chatWithGPT();
