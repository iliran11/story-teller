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

module.exports = getTopic;
