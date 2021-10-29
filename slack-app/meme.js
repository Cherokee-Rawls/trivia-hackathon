const https = require('https');
const querystring = require('querystring');

class Meme {
  constructor() {
    this.templateId = '';
    this.congratz = 'Congratz';
    this.winner = 'Jake!';
    this.generatedImgUrl = '';
  }

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
        console.log(myOutput.data.memes[0].id);
        this.templateId = myOutput.data.memes[0].id;
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
      'username': 'thorfio',
      'password': '87654321',
      'text0': this.congratz,
      'text1': this.winner
    });

    const post_options = {
      hostname: 'api.imgflip.com',
      port: 443,
      path: `/caption_image?text0=${this.congratz}&text1=${this.winner}!&password=&username=thorfio&template_id=${this.templateId}`,
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