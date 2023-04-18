require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
// const { findCustomResponse } = require('speech'); // fetch custom speech file


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// Set up the Google Cloud Speech-to-Text client
const client = new speech.SpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Text-to-Speech client
const ttsClient = new textToSpeech.TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Create the axiosInstance with the proper configuration
const axiosInstance = axios.create({
    baseURL: 'https://api.openai.com',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

// Set up the OpenAI API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  


app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/upload', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }

    let wavFile;

    try {
        const oggOpusFile = req.file.path;
        const wavFile = path.join('uploads', `${path.parse(oggOpusFile).name}.wav`);

        if (req.file.mimetype === 'audio/ogg') {
          await convertOggOpusToWav(oggOpusFile, wavFile);
        } else if (req.file.mimetype === 'audio/webm') {
          await convertWebmOpusToWav(oggOpusFile, wavFile);
        } else {
          throw new Error(`Unsupported audio format: ${req.file.mimetype}`);
        }

        const buffer = fs.readFileSync(wavFile);
        const audio = {
        content: buffer.toString('base64'),
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        const processedResponse = await processText(transcription);
        res.json({ responseText: processedResponse.responseText, audioData: processedResponse.audioData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing audio' });
    } finally {
        // Clean up the uploaded and converted files
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        if (wavFile) {
          fs.unlinkSync(wavFile);
        }
    }
});

app.post('/submit-text', async (req, res) => {
    const inputText = req.body.text;

    try {
        const processedResponse = await processText(inputText);
        res.json({ responseText: processedResponse.responseText, audioData: processedResponse.audioData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing text input' });
    }
});

async function processText(text) {
    
    // Send the text to the OpenAI API and get a response
    let prompt;

    if (text.toLowerCase().includes("what is your name")) {
      prompt = `User: ${text}\nJarvis: `;
    } else if (text.toLowerCase().includes("what is your full name")) {
      prompt = `User: ${text}\nJarvis Priyadarshi: `;
    }else if(text.toLowerCase().includes("what is your first name")){
      prompt = `User: ${text}\nJarvis:`;
    }else if(text.toLowerCase().includes("what is your last name")){
      prompt = `User: ${text}\nPriyadarshi:`;
    }else if(text.toLowerCase().includes("what is your surname name")){
      prompt = `User: ${text}\nPriyadarshi:`;
    }else{
      prompt = `User: ${text}\nJarvis:`;
    }

  //   const customResponse = findCustomResponse(text);

  // let prompt;
  // if (customResponse) {
  //   prompt = `User: ${text}\nJarvis: ${customResponse}`;
  // } else {
  //   prompt = `User: ${text}\nJarvis:`;
  // }

  ///////

 
    const openaiResponse = await createCompletion(prompt, 'text-davinci-003');
  
    // Extract the response text from the API response
    const responseText = openaiResponse.choices[0].text.trim();
  
    const request = {
      input: { text: responseText },
      voice: { languageCode: 'en-GB', name: 'en-GB-Standard-D' },
      audioConfig: { audioEncoding: 'MP3' },
    };
  
    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioData = response.audioContent.toString('base64');
  
    return { responseText, audioData };
  }
  
  const { exec } = require("child_process");

  function convertOggOpusToWav(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${inputFile} -ac 1 -ar 16000 ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting Ogg Opus to WAV: ${error.message}`);
          reject(error);
        } else {
          console.log(`Converted Ogg Opus to WAV: ${stdout}`);
          resolve(outputFile);
        }
      });
    });
  }
  
  

  function convertWebmOpusToWav(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${inputFile} -ac 1 -ar 16000 ${outputFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error converting WebM Opus to WAV: ${error.message}`);
          reject(error);
        } else {
          console.log(`Converted WebM Opus to WAV: ${stdout}`);
          resolve(outputFile);
        }
      });
    });
  }
  

  

async function createCompletion(prompt, modelId) {
    try {
      const data = {
        model: modelId,
        prompt: prompt,
        max_tokens: 150,
        n: 1,
        stop: null,
        temperature: 0.5,
      };
      const response = await axiosInstance.post('/v1/completions', data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  }
  
  // // Usage example
  // createCompletion('User: \nAI:', 'text-davinci-003');
  



http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
