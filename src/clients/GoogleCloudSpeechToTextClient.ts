import speech from '@google-cloud/speech'
import {google} from '@google-cloud/speech/build/protos/protos'
import * as fs from 'fs'
import IRecognitionConfig = google.cloud.speech.v1.IRecognitionConfig
import {SpeechClient} from '@google-cloud/speech/build/src/v1'

import {GoogleCloudSpeechToTextError} from '../errors'

export class GoogleCloudSpeechToTextClient {
    public static getInstance(): GoogleCloudSpeechToTextClient {
        return new GoogleCloudSpeechToTextClient(new speech.SpeechClient())
    }

    constructor(private readonly googleCloudSpeechClient: SpeechClient) {}

    private readonly recognitionConfig: IRecognitionConfig = {
        enableAutomaticPunctuation: true,
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    }

    public async transcribeWavAudioFile(wavAudioFilePath: string): Promise<string> {
        try {
            return await new Promise((resolve, reject) => {
                const results: string[] = []
                const request = {
                    interimResults: false,
                    config: this.recognitionConfig,
                }
                const recognizeStream = this.googleCloudSpeechClient
                    .streamingRecognize(request)
                    .on('error', err => reject(err))
                    .on('data', data => {
                        results.push(data.results[0].alternatives[0].transcript)
                    })
                    .on('finish', () => {
                        resolve(results.join('\n\n'))
                    })
                fs.createReadStream(wavAudioFilePath).pipe(recognizeStream)
            })
        } catch (e) {
            throw new GoogleCloudSpeechToTextError(wavAudioFilePath, e)
        }
    }
}
