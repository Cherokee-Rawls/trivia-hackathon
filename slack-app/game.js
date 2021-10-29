
const triviaApi = require('./trivia-api');

class Game {
    constructor(numberOfQuestions = 10, timeBetweenQuestionsMs = 15000) {
        this.numberOfQuestions = numberOfQuestions;
        this.answers = {};
        this.currentQuestionIndex = 0;
        this.counter = {
            numberOfTicks: 0,
            counterRef: null,
            interval: timeBetweenQuestionsMs
        }
    }

    async startGame() {
        this.questions = await triviaApi.getTriviaQuestions(this.numberOfQuestions);
        this.answers = new Array(this.questions.length).fill([]);
        return this.getCurrentQuestion();
    }

    getNextQuestion() {
        if (this.currentQuestionIndex === this.questions.length - 1) {
            return null;
        }

        ++this.currentQuestionIndex;
        return this.getCurrentQuestion();
    }

    getCurrentQuestion() {
        return {
            question: this.questions[this.currentQuestionIndex].question,
            choices: this.questions[this.currentQuestionIndex].choices
        }
    }

    checkCurrentAnswer(choiceIndex) {
        return this.questions[this.currentQuestionIndex].answer === this.getCurrentQuestion().choices[+choiceIndex];
    }

    addParticipant(username, answer) {
        if (!this.answers[this.currentQuestionIndex]) {
            this.answers[this.currentQuestionIndex] = []
        }

        this.answers[this.currentQuestionIndex] = this.answers[this.currentQuestionIndex]
            .filter(a => a.username !== username)
            .concat([{
                username,
                answer
            }]);
    }

    getCurrentParticipants() {
        return this.answers[this.currentQuestionIndex].map(a => a.username);
    }

    getCurrentResult() {
        return this._getResultsForQuestion(this.currentQuestionIndex);
    }

    getAllResults() {
        return this.questions.map((_, index) => _getResultsForQuestion(index));
    }

    getCounterRef() {
        return this.counter.counterRef;
    }

    setCounterRef(counterRef) {
        this.counter.counterRef = counterRef;
    }

    getNumberOfTicks() {
        return this.counter.numberOfTicks;
    }

    setNumberOfTicks(ticks) {
        this.counter.numberOfTicks = ticks;
    }

    _getResultsForQuestion(index) {
        return {
            question: this.questions[index].question,
            answer: this.questions[index].answer,
            correctUsers: this.answers[index].filter(a => a.answer === this.questions[index].answer)
        }
    }
}

module.exports = Game;