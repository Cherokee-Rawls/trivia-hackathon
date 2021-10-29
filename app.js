// Require the Bolt package (github.com/slackapi/bolt)
require('dotenv').config();
const { App } = require("@slack/bolt");
const GameState = require('./game-state');
const messages = require('./messages');
const Meme = require('./meme.js');

const responseTimeSeconds = 15;
const timerUpdateIntervalMs = 2000;

const gameState = new GameState();
const meme = new Meme();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/ssb_trivia', async ({ ack, payload, context }) => {
  await ack();

  try {
      const message = await messages.postLoadingMessage(app, context.botToken, payload.channel_id);

      await gameState.newGame(message.ts, 2).startGame();
      await updateCurrentQuestionDisplay(message.channel, context.botToken, message.ts, responseTimeSeconds);
      beginCountdown(message.channel, context.botToken, message.ts);
    }
    catch (error) {
      console.error(error);
    }
});

function beginCountdown(channelId, botToken, tsId) {
    let game = gameState.getGame(tsId);

    game.setCounterRef(setInterval(async () => {
        let currentTicks = game.getNumberOfTicks();
        let currentTime = responseTimeSeconds - (currentTicks * (timerUpdateIntervalMs / 1000));

        game.setNumberOfTicks(currentTicks + 1);

        if (currentTime <= 0) {
            clearTimeout(game.getCounterRef());
            await messages.postCorrectAnswer(app, botToken, channelId, tsId, game.getCurrentResult());
            if (game.getNextQuestion() != null) {
                currentTime = responseTimeSeconds;
                game.setNumberOfTicks(0);
                beginCountdown(channelId, botToken, tsId);
            } else {
                let results = game.getAllResults();
                let memeResult = meme.getMeme(results[0].participant);
                return await messages.updateFinalResults(app, botToken, channelId, tsId, results);
            }
        }

        await updateCurrentQuestionDisplay(channelId, botToken, tsId, currentTime);
    }, timerUpdateIntervalMs));
}

async function updateCurrentQuestionDisplay(channelId, botToken, tsId, remainingSeconds) {
    const game = gameState.getGame(tsId);
    const currentQuestion = game.getCurrentQuestion();
    const participants = game.getCurrentParticipants();

    try {
        console.log(participants)
        await messages.updateTriviaQuestionDisplay(app, botToken, channelId, tsId, currentQuestion.number, currentQuestion.question, currentQuestion.choices, participants, remainingSeconds);
      }
      catch (error) {
        console.error(error);
      }
}

app.action('select_answer', async ({ ack, body, context }) => {
  const choiceIndex = body.actions[0].selected_option.value;
  const username = body.user.username;
  await ack();

  console.log(body.channel.id);

  const game = gameState.getGame(body.message.ts);
  game.addParticipant(username, game.getCurrentQuestion().choices[choiceIndex]);
  let currentTicks = game.getNumberOfTicks();
  let currentTime = responseTimeSeconds - (currentTicks * (timerUpdateIntervalMs / 1000));
  updateCurrentQuestionDisplay(body.channel.id, context.botToken, body.message.ts, currentTime);
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();