const Game = require('./game');

class GameState {
    constructor() {
        this.games = {};
    }

    newGame(messageId, numberOfQuestions) {
        return this.games[messageId] = new Game(numberOfQuestions);
    }

    getGame(messageId) {
        const game = this.games[messageId];
        if (game == null) {
            console.error(`Game for message ${messageId} not found.`)
        }

        return game;
    }
}

module.exports = GameState;