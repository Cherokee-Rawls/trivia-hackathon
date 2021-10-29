// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const triviaApi = require('./trivia-api');
require('dotenv').config();

console.log(process.env.PORT);

let currentQuestionSet = null;

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// All the room in the world for your code

// app.command('/ssb_trivia', async ({ ack, payload, context }) => {
//   // Acknowledge the command request
//   await ack();

//   console.log("ssb_trivia payload:", payload);

//   console.log("user: ", payload.user_name);
//   console.log("team_id: ", payload.team_id);
//   currentQuestionSet = await triviaApi.getTriviaQuestions(1);

//   try {
//     await app.client.chat.postMessage({
//       token: context.botToken,
//       // Channel to send message to
//       channel: payload.channel_id,
//       // Include a button in the message (or whatever blocks you want!)
//       blocks: [
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: `${currentQuestionSet[0].question}`
//           }
//         },
//         {
//           type: 'actions',
//           elements: currentQuestionSet[0].choices.map((choice, index) => (
//             {
//               type: "button",
//               text: {
//                 type: 'plain_text',
//                 text: choice
//               },
//               action_id: `choice_select_${index}`
//             }
//           ))
//         }
//       ],
//       // Text in the notification
//       text: 'Message from Test App'
//     });
//   }
//   catch (error) {
//     console.error(error);
//   }
// });

// app.action('choice_select_0', async ({ ack, body, context }) => {
//   handleSelection(ack, body, context, 0)
// });

// app.action('choice_select_1', async ({ ack, body, context }) => {
//   handleSelection(ack, body, context, 1)
// });

// app.action('choice_select_2', async ({ ack, body, context }) => {
//   handleSelection(ack, body, context, 2)
// });

// app.action('choice_select_3', async ({ ack, body, context }) => {
//   handleSelection(ack, body, context, 3)
// });

// async function handleSelection(ack, body, context, choiceIndex) {
//   await ack();

//   try {    
//     await app.client.chat.postMessage({
//         token: context.botToken,
//         // Channel to send message to
//         channel: body.channel_id,
//         // Include a button in the message (or whatever blocks you want!)
//         blocks: [
//             {
//                 type: 'section',
//                 text: {
//                     type: 'mrkdwn',
//                     text: `You are ${currentQuestionSet[0].choices[choiceIndex] == currentQuestionSet[0].answer ? 'Correct!' : 'WRONG!' }`
//                 }
//             }
//         ],
//         // Text in the notification
//         text: 'Message from Test App'
//         });
//   } catch (error) {
//     console.error(error);
//   }
// }



app.command('/ssb_trivia', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  await ack();

  console.log("user: ", payload.user_name);
  console.log("team_id: ", payload.team_id);
  currentQuestionSet = await triviaApi.getTriviaQuestions(1);

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          "type": "section",
          "text": {
            "type": 'plain_text',
            "text": `${currentQuestionSet[0].question}`
          },
          "accessory": {
            "type": "radio_buttons",
            "options": currentQuestionSet[0].choices.map((choice, index) => (
              {
                value: `${index}`,
                text: {
                  type: 'plain_text',
                  text: choice,
                  emoji: true
                }
              }
            )),
            "action_id": "select_answer"
          }
        }
      ]
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.action('select_answer', async ({ ack, body, context }) => {
  console.log(body);
  console.log(body.actions[0].selected_option);
  const choiceIndex = body.actions[0].selected_option.value;
  
  await ack();

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
                    text: `You are ${currentQuestionSet[0].choices[choiceIndex] == currentQuestionSet[0].answer ? 'Correct!' : 'WRONG!' }`
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