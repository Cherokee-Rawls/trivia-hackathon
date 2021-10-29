module.exports.postLoadingMessage = (app, botToken, channelId) => {
  return app.client.chat.postMessage({
    token: botToken,
    channel: channelId,
    blocks: [{
      "type": "section",
      "text": {
        "type": 'mrkdwn',
        "text": `Loading...`
      },
    }]
  });
};

module.exports.updateTriviaQuestionDisplay = (app, botToken, channelId, tsId, number, question, choices, participants, remainingSeconds) => {
  console.log('message', remainingSeconds);
  console.log(question);
  return app.client.chat.update({
    token: botToken,
    // Channel to send message to
    channel: channelId,
    ts: tsId,
    // Include a button in the message (or whatever blocks you want!)
    blocks: [{
      "type": "section",
      "text": {
        "type": 'mrkdwn',
        "text": `*${number}.* ${question}`
      },
      "accessory": {
        "type": "radio_buttons",
        "options": choices.map((choice, index) => ({
          value: `${index}`,
          text: {
            type: 'mrkdwn',
            text: choice
          }
        })),
        "action_id": "select_answer"
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Participants: ${participants.map(v => `@${v}`).join(', ')}`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Remaining time: *${remainingSeconds}s*`
      }
    }]
  });
};

module.exports.postCorrectAnswer = (app, botToken, channelId, threadTs, results) => {
  return app.client.chat.postMessage({
    token: botToken,
    channel: channelId,
    thread_ts: threadTs,
    blocks: [
      {
        "type": "section",
        "fields": [
          {
            "type": 'mrkdwn',
            "text": `*${results.number}.* ${results.question}`
          },
          {
            "type": 'mrkdwn',
            "text": `The answer was: *${results.answer}*`
          },
          {
            "type": 'mrkdwn',
            "text": results.correctUsers.length ? `:partyparrot: Good job ${results.correctUsers.map(v => `@${v}`).join(', ')}` : 'No one got it :disappointed:'
          }
        ]
      }]
  });
};

module.exports.updateFinalResults = (app, botToken, channelId, tsId, results, memeUrl) => {
  return app.client.chat.update({
    token: botToken,
    channel: channelId,
    ts: tsId,
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*The Winners:* :trophy:"
        }
      },
      ...results.map((r, i) => (
        {
          "type": "section",
          "text": {
            "type": 'mrkdwn',
            "text": `${getPlaceEmojiOrText(i + 1)} @${r.participant} with ${r.score}`
          }
        }
      )),
      {
        "type": "image",
        "image_url": memeUrl,
        "alt_text": 'Winner winner chicken dinner'
      }
    ]
  });
};

function getPlaceEmojiOrText(rank) {
  switch (rank) {
    case 1:
      return ':first_place_medal:';
    case 2:
      return ':second_place_medal:';
    case 3:
      return ':third_place_medal:';
    default:
      return `${rank}.`;
  }
}