const fetch = require('node-fetch-commonjs');
const { decode } = require('html-entities');

class TriviaApi {
  async getTriviaQuestions(count = 10, category = 31) {
    const result = await fetch(`https://opentdb.com/api.php?amount=${count}&category=${category}`);
    const data = await result.json();
    return data.results.map(q => ({
      question: decode(q.question),
      choices: [q.correct_answer, ...q.incorrect_answers].map(c => decode(c)).sort(),
      answer: decode(q.correct_answer)
    }));
  }
}

module.exports = new TriviaApi();