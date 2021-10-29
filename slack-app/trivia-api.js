const fetch = require('node-fetch-commonjs');

class TriviaApi {
    async getTriviaQuestions(count = 10, category = 9) {
        const result = await fetch(`https://opentdb.com/api.php?amount=${count}&category=${category}`);
        const data = await result.json();
        return data.results.map(q => ({
            question: q.question,
            choices: [ q.correct_answer, ...q.incorrect_answers ].sort(),
            answer: q.correct_answer
        }));
    }
}

module.exports = new TriviaApi();