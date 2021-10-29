const https = require('https');

const meme = new Meme();
meme.getMeme();
meme.postMeme();
console.log(meme.generatedImgUrl);

class Meme {
    constructor() {
        this.templateId = '';
        this.congratz = 'Congratz';
        this.winner = 'Jake!';
        this.generatedImgUrl = '';
    }

    getMeme() {
      https.get('https://api.imgflip.com/get_memes', (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        let memes = JSON.parse(data).memes;
        this.templateId = memes[0].id;

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          console.log(memes[0]);
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    }

    postMeme() {
      const postData = JSON.stringify({
        'msg': 'Hello World!'
      });
      
      const options = {
        hostname: 'api.imgflip.com/caption_image',
        port: 80,
        path: '/upload',
        method: 'POST',
        body: {
          'template_id':this.templateId,
          'username':'val',
          'password':'val',
          'text0':this.congratz,
          'text1':this.winner
        },
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
      });
      
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      
      // Write data to request body
      req.write(postData);
      req.end();

      let resJson = JSON.parse(res.body);
      this.generatedImgUrl = resJson.data.url;      
    }
}

