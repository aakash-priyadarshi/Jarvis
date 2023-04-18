# Jarvis v1.0
![Built with Node.js](https://img.shields.io/badge/Built%20with-Node.js-339933?style=for-the-badge&logo=node.js)
![Built with HTML](https://img.shields.io/badge/Built%20with-HTML-E34F26?style=for-the-badge&logo=html5)
![OpenAI API](https://img.shields.io/badge/OpenAI-API-2A2D2E?style=for-the-badge&logo=openai)
![Google Cloud API](https://img.shields.io/badge/Google%20Cloud-API-4285F4?style=for-the-badge&logo=google-cloud)



 An openai language model which can manually talk.
 This the most simple version which was built to test if I can make the GPT 3.5 talk like Jarvis as we see in Iron Man movie.
 The application is totally based on Node.js and simple HTML.
 


# OpenAI-Based Web Application

This is an openAI-based web application built using Node.js and HTML. The application utilizes various Node.js modules, including:

- `@google-cloud/speech`: a Node.js client library for Google Cloud Speech-to-Text API.
- `@google-cloud/text-to-speech`: a Node.js client library for Google Cloud Text-to-Speech API.
- `audiobuffer-to-wav`: a module to convert AudioBuffer to WAV.
- `dotenv`: a zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- `express`: a fast, unopinionated, minimalist web framework for Node.js.
- `multer`: a middleware for handling `multipart/form-data`, which is primarily used for uploading files.
- `node-microphone`: a Node.js module for recording audio from the microphone.
- `openai`: a Node.js client library for OpenAI API.
- `say`: a simple text-to-speech module for Node.js.
- `socket.io`: a library that enables real-time, bidirectional and event-based communication between the browser and the server.

## Installation

1. Clone the repository
   ```sh
   git clone https://github.com/aakash-priyadarshi/jarvis
   
2. Install NPM packages
   ```sh
   npm install
   ```
3. Enable the Google Cloud Speech-to-Text and Text-to-Speech APIs and download a service account key in JSON format. Save the key as `google-credentials.json` in the root directory of the project.

4. Create a .env file in the root directory and add the following environment variables:
   ```sh
   OPENAI_API_KEY=your_api_key
   GOOGLE_APPLICATION_CREDENTIALS=path_to_service_account_key_file
   ```
5. Start the server
   ```sh
   npm start
   ```
6. Open the application in your browser at http://localhost:3000

# Usage
The web application has the following features:

1. Open `http://localhost:3000` in your browser.
2. Click on the "Start Recording" button and allow microphone access.
3. Speak your command.
4. Wait for the app to generate a response.

## Dependencies

- Node.js: [![Node.js Version][node-image]][node-url]
- HTML5: [![HTML5 Version][html5-image]][html5-url]
- OpenAI: [![OpenAI Version][openai-image]][openai-url]
- Google Cloud: [![Google Cloud Version][google-cloud-image]][google-cloud-url]

[node-image]: https://img.shields.io/badge/Node.js-v18.15.0-green.svg
[node-url]: https://nodejs.org/en/download/
[html5-image]: https://img.shields.io/badge/HTML5-v5-orange.svg
[html5-url]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5
[openai-image]: https://img.shields.io/badge/OpenAI-v3.2.1-yellow.svg
[openai-url]: https://pypi.org/project/openai/
[google-cloud-image]: https://img.shields.io/badge/Google%20Cloud-v1.0-blue.svg
[google-cloud-url]: https://console.cloud.google.com/

## Donate

If you find this project helpful and would like to support its further development, you can buy me a coffee through PayPal at the link below:

[![PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal)](https://www.paypal.com/paypalme/aakashm301)
[![UPI](https://img.shields.io/badge/Donate-UPI-blue?style=for-the-badge)](https://drive.google.com/file/d/1-k2aegxW30OLvNpfqFCTQEAckVun2Qwz/view?usp=sharing)


# License
<a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>.

## Changelogs

### v1.0

```sh
First release.

```
### v1.0.1

```sh
Added custom speeches.

```
