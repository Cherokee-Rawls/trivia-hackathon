// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const GameState = require('./game-state');
const messages = require('./messages');
require('dotenv').config();

const gameState = new GameState();

const responseTimeSeconds = 15;
const timerUpdateIntervalMs = 5000;
// let timerUpdateCount = 0;
// let counterRef = null;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// All the room in the world for your code

app.command('/ssb_trivia', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  await ack();


  try {
      const message = await messages.postLoadingMessage(app, context.botToken, payload.channel_id);

      await gameState.newGame(payload.channel_id).startGame();
      await updateCurrentQuestionDisplay(message.channel, context.botToken, message.ts, responseTimeSeconds);
      beginCountdown(message.channel, context.botToken, message.ts);
    }
    catch (error) {
      console.error(error);
    }
});

function beginCountdown(channelId, botToken, tsId) {
    let game = gameState.getGame(channelId);

    game.setCounterRef(setInterval(async () => {
        let currentTicks = game.getNumberOfTicks();
        let currentTime = responseTimeSeconds - (currentTicks * (timerUpdateIntervalMs / 1000));
        console.log(currentTime);

        game.setNumberOfTicks(currentTicks + 1);

        if (currentTime <= 0) {
            clearTimeout(game.getCounterRef());
            timerUpdateCount = 0;
            game.getNextQuestion();
            currentTime = responseTimeSeconds;
            game.setCounterRef(beginCountdown(channelId, botToken, tsId));
        }

        console.log('before update', currentTime)
        await updateCurrentQuestionDisplay(channelId, botToken, tsId, currentTime);
    }, timerUpdateIntervalMs));
}

async function updateCurrentQuestionDisplay(channelId, botToken, tsId, remainingSeconds) {
    const game = gameState.getGame(channelId);
    const currentQuestion = game.getCurrentQuestion();
    const participants = game.getCurrentParticipants();

    try {
        console.log(participants)
        await messages.updateTriviaQuestionDisplay(app, botToken, channelId, tsId, currentQuestion.question, currentQuestion.choices, participants, remainingSeconds);
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

  const game = gameState.getGame(body.channel.id);
  game.addParticipant(username, choiceIndex)
  let currentTicks = game.getNumberOfTicks();
  let currentTime = responseTimeSeconds - (currentTicks * (timerUpdateIntervalMs / 1000));
  updateCurrentQuestionDisplay(body.channel.id, context.botToken, body.message.ts, currentTime);

  try {    
    await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: body.channel.id,
        thread_ts: body.message.ts,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `You are ${game.checkCurrentAnswer(choiceIndex) ? 'Correct!' : 'WRONG!' }`
                }
            }
        ],
        // Text in the notification
        text: 'Message from Test App'
        });
  } catch (error) {
    console.error(error);
  }
});


(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();