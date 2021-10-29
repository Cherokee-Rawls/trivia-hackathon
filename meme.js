const https = require('https');
const querystring = require('querystring');

const password = process.env.MEME_PASSWORD;
const username = process.env.MEME_USERNAME;

class Meme {
  constructor() {
    this.templateId = '';
    this.congratz = 'Congratz';
    this.winner = 'Jake!';
    this.generatedImgUrl = '';
  }

  const getMemePromise = new Promise((resolve, reject) => {
    this.winner = winner;

    https.get('https://api.imgflip.com/get_memes', (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let myOutput = JSON.parse(data);
        const numberOfMemes = myOutput.data.memes.length;
        const memeId = myOutput.data.memes[Math.floor(Math.random() * numberOfMemes)].id;
        console.log(memeId);
        this.templateId = memeId;
        this.postMeme().then(() => {
          return 
        });
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  });

  const postMemePromise = new Promise((resolve, reject) => {
    console.log(this.congratz);

    // Build the post string from an object
    var post_data = querystring.stringify({
      'template_id': this.templateId,
      'username': username,
      'password': password,
      'text0': this.congratz,
      'text1': this.winner
    });

    const post_options = {
      hostname: 'api.imgflip.com',
      port: 443,
      path: `/caption_image?text0=${this.congratz}&text1=${this.winner}!&password=${password}&username=${username}&template_id=${this.templateId}`,
      method: 'POST'
    };

    // Set up the request
    var post_req = https.request(post_options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });

    // Write data to request body
    post_req.write(post_data);
    post_req.end();
  });

  getMeme(winner) {
    this.winner = winner;

    https.get('https://api.imgflip.com/get_memes', (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let myOutput = JSON.parse(data);
        const numberOfMemes = myOutput.data.memes.length;
        const memeId = myOutput.data.memes[Math.floor(Math.random() * numberOfMemes)].id;
        console.log(memeId);
        this.templateId = memeId;
        this.postMeme();
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

  postMeme() {
    console.log(this.congratz);

    // Build the post string from an object
    var post_data = querystring.stringify({
      'template_id': this.templateId,
      'username': username,
      'password': password,
      'text0': this.congratz,
      'text1': this.winner
    });

    const post_options = {
      hostname: 'api.imgflip.com',
      port: 443,
      path: `/caption_image?text0=${this.congratz}&text1=${this.winner}!&password=${password}&username=${username}&template_id=${this.templateId}`,
      method: 'POST'
    };

    // Set up the request
    var post_req = https.request(post_options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });

    // Write data to request body
    post_req.write(post_data);
    post_req.end();
  }
}

module.exports = Meme;