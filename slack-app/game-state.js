const Game = require('./game');

class GameState {
    constructor() {
        this.games = {};
    }

    newGame(channelId, numberOfQuestions) {
        return this.games[channelId] = new Game(numberOfQuestions);
    }

    getGame(channelId) {
        const game = this.games[channelId];
        if (game == null) {
            console.error(`Game for channel ${channelId} not found.`)
        }

        return game;
    }
}

module.exports = GameState;