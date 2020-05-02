import 'mocha'

import {Arg, Substitute, SubstituteOf} from '@fluffy-spoon/substitute'
import {SpeechClient} from '@google-cloud/speech/build/src/v1'
import * as pumpify from 'pumpify'
import {PassThrough, Transform} from 'stream'

import {GoogleCloudSpeechToTextClient} from '../../src/clients/GoogleCloudSpeechToTextClient'
import {GoogleCloudSpeechToTextError} from '../../src/errors'
import {expect} from '../expect'
import {TestFixtures} from '../resources/TestFixtures'

describe('GoogleCloudSpeechToTextClient', () => {
    let mockedGoogleSpeechClient: SubstituteOf<SpeechClient>
    let sut: GoogleCloudSpeechToTextClient
    beforeEach(async () => {
        mockedGoogleSpeechClient = Substitute.for<SpeechClient>()
        sut = new GoogleCloudSpeechToTextClient(mockedGoogleSpeechClient)
    })

    describe('has a method named transcribeAudioFile', () => {
        it('which returns transcription for audio file in happy path', async () => {
            const transformStream = new Transform({
                readableObjectMode: true,

                transform(chunk, encoding, callback) {
                    callback(undefined)
                },
                flush(callback) {
                    // put transcription when input stream ends
                    callback(undefined, TestFixtures.googleSpeechSdkResponse('mock-transcription'))
                },
            })

            mockedGoogleSpeechClient
                .streamingRecognize(Arg.all())
                .returns(new pumpify.obj(new PassThrough(), transformStream))

            const result = await sut.transcribeWavAudioFile(TestFixtures.wavAudioFile())
            expect(result).to.equal('mock-transcription')
        })

        it('which throws an error when Google speech response stream has an error', async () => {
            const transformStream = new Transform({
                readableObjectMode: true,

                transform(chunk, encoding, callback) {
                    callback(new Error('mock-google-error'))
                },
            })

            mockedGoogleSpeechClient
                .streamingRecognize(Arg.all())
                .returns(new pumpify.obj(new PassThrough(), transformStream))

            await expect(
                sut.transcribeWavAudioFile(TestFixtures.wavAudioFile())
            ).to.eventually.rejectedWith(GoogleCloudSpeechToTextError, 'mock-google-error')
        })
    })
})
