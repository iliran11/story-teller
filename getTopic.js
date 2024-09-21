const fns = require("./functions");
const fs = require("fs");

const getTopic = async () => {
  const usedTopics = fs
    .readFileSync("./instructions/used-topics.txt", "utf-8")
    .replace("\n", " ,");
  let topicSuggestion = fns.instruction.getSuggestion();
  topicSuggestion = `${topicSuggestion} Do not used the following topics: ${usedTopics}`;
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
  fs.appendFileSync("./instructions/used-topics.txt", "utf-8");
  console.log(`[Bot][Suggestion]: ${answer.topic}`);
  return answer.topic;
};

module.exports = getTopic;
