
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
        this.questions = (await triviaApi.getTriviaQuestions(this.numberOfQuestions));
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
            number: this.currentQuestionIndex + 1,
            question: this.questions[this.currentQuestionIndex].question,
            choices: this.questions[this.currentQuestionIndex].choices
        }
    }

    addParticipant(username, answer) {
        this.answers[this.currentQuestionIndex] = this.answers[this.currentQuestionIndex]
            .filter(a => a.username !== username)
            .concat([{
                username,
                answer,
                isCorrect: this.questions[this.currentQuestionIndex].answer === answer
            }]);
    }

    getCurrentParticipants() {
        return this.answers[this.currentQuestionIndex].map(a => a.username);
    }

    getCurrentResult() {
        return {
            number: this.currentQuestionIndex + 1,
            question: this.questions[this.currentQuestionIndex].question,
            answer: this.questions[this.currentQuestionIndex].answer,
            correctUsers: this.answers[this.currentQuestionIndex].filter(a => a.isCorrect).map(a => a.username)
        }
    }

    getAllResults() {
        const participants = [...new Set(Object.values(this.answers).flatMap(a => a).map(a => a.username))];
        const scores = participants.map(p => Object.values(this.answers).flatMap(a => a).filter(a => p === a.username).map(a => a.isCorrect).reduce((a, b) => a + b, 0));
        return participants.map((p, i) => ({
            participant: p,
            score: scores[i]
        })).sort((a, b) => +b.score - +a.score);
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
}

module.exports = Game;