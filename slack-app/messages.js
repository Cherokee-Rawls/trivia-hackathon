module.exports.postLoadingMessage = (app, botToken, channelId) => {
    return app.client.chat.postMessage({
        token: botToken,
        channel: channelId,
        blocks: [{
            "type": "section",
            "text": {
                "type": 'plain_text',
                "text": `Loading...`
            },
        }]
    });
};

module.exports.updateTriviaQuestionDisplay = (app, botToken, channelId, tsId, question, choices, participants, remainingSeconds) => {
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
                "type": 'plain_text',
                "text": `${question}`
            },
            "accessory": {
            "type": "radio_buttons",
            "options": choices.map((choice, index) => ({
                value: `${index}`,
                text: {
                    type: 'plain_text',
                    text: choice,
                    emoji: true
                }
            })),
            "action_id": "select_answer"
            }
        },
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `Participants: ${participants.map(v => `@${v},`)}`
            }
        },
        {
            type: 'section',
            text: {
                type: 'plain_text',
                text: `Remaining time: ${remainingSeconds}s`
            }    
        }]
    });
};