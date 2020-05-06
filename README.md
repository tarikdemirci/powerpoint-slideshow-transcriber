# powerpoint-slideshow-transcriber

Transcribe Powerpoint slideshows (*.ppsx files) using Google Cloud Speech-to-Text API.

## Prerequisites
- Access to Google Cloud Speech-to-Text API
    - See [Google Cloud Project Setup Instructions](#google-cloud-project-setup-instructions) for exact steps.
- Node.js >= 12

## Usage
```
export GOOGLE_APPLICATION_CREDENTIALS='<path-to-your-service-account-credentials-file>';
npx powerpoint-slideshow-transcriber <path-to-ppsx-file>
```
**Example**

```
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/credentials/google-cloud-service-account-credentials.json"
npx powerpoint-slideshow-transcriber powerpoint-show-transcriber-test-data.ppsx
```
*Output for the command above:*
```
Processing ppsx file: 'powerpoint-show-transcriber-test-data.ppsx'
Transcription saved to: 'powerpoint-show-transcriber-test-data-transcription.txt'
Success!
```
*Note:* A sample .ppsx file and a sample transcription is accessible under [test/resources/](https://github.com/tarikdemirci/powerpoint-slideshow-transcriber/tree/master/test/resources).

## Google Cloud Project Setup Instructions
1. Create a project in Google Cloud.
2. Enable Speech-to-Text API for the project.
3. Create a service account for the project.
4. Download private key for the service account as JSON.

For more info: [Google Cloud documentation](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries#before-you-begin)
