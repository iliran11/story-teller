const fns = require("./functions");
const fs = require("fs");

const getTopic = async () => {
  let topicSuggestion = fns.instruction.getSuggestion();
  const suggestionMessages = [fns.createMessage("user", topicSuggestion)];
  const { answer } = await fns.callOpenAi({
    messages: suggestionMessages,
    json: true,
  });
  suggestionMessages.push(fns.createMessage("assistant", answer.topic));
  if (!answer.topic) {
    throw new Error("Something is wrong with the subject provided by OpenAI");
  }
  fs.appendFileSync("./instructions/used-topics.txt", "utf-8");
  console.log(`[Bot][Suggestion]: ${answer.topic}`);
  return answer.topic;
};

module.exports = getTopic;
