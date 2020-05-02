import {promises as fsPromises} from 'fs'

export class TestFixtures {
    public static ppsxFile(): string {
        return 'test/resources/powerpoint-show-transcriber-test-data.ppsx'
    }

    public static m4aAudioFilePath(): string {
        return 'test/resources/media1.m4a'
    }

    public static wavAudioFile(): string {
        return 'test/resources/media1.wav'
    }

    public static async mockPpsxTranscription(): Promise<string> {
        const transcription = await fsPromises.readFile(
            'test/resources/mock-ppsx-transcription.txt'
        )
        return transcription.toString()
    }

    public static googleSpeechSdkResponse(transcription: string): {} {
        return {
            results: [
                {
                    alternatives: [
                        {
                            transcript: transcription,
                        },
                    ],
                },
            ],
        }
    }
}
