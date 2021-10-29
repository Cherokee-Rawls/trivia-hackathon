// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const {  } = require("@slack/interactive-messages");
require('dotenv').config()

console.log(process.env.PORT);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// All the room in the world for your code

app.command('/ssb_trivia', async ({ ack, payload, context }) => {
    // Acknowledge the command request
    await ack();
  
    try {
      const result = await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Go ahead. Click it.'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          }
        ],
        // Text in the notification
        text: 'Message from Test App'
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });

// Listen for a button invocation with action_id `button_abc`
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('button_abc', async ({ ack, body, context }) => {
    // Acknowledge the button request
    await ack();
  
    try {
      // Update the message
      const result = await app.client.chat.update({
        token: context.botToken,
        // ts of message to update
        ts: body.message.ts,
        // Channel of message
        channel: body.channel.id,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*The button was clicked!*'
            }
          }
        ],
        text: 'Message from Test App'
      });
      console.log(result);
    }
    catch (error) {
      console.error(error);
    }
  });
  
app.message('knock knock', async ({ message, say }) => {
  await say(`_Who's there?_`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();