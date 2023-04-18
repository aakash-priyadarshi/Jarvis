const customResponses = {
    "what is your name": "My name is Jarvis.",
    "what is your full name": "My full name is Jarvis Priyadarshi.",
    "what is your first name": "My first name is Jarvis.",
    "what is your last name": "My last name is Priyadarshi.",
    "what is your surname": "My surname is Priyadarshi.",
    "what is your date of birth": "My date of birth is 17 April 2020."
  };
  
  function findCustomResponse(text) {
    const lowerCaseText = text.toLowerCase();
    for (const prompt in customResponses) {
      if (lowerCaseText.includes(prompt)) {
        return customResponses[prompt];
      }
    }
    return null;
  }
  
  module.exports = {
    findCustomResponse,
  };  