import {promises as fsPromises} from 'fs'
import * as path from 'path'

import {GoogleCloudSpeechToTextClient} from '../clients/GoogleCloudSpeechToTextClient'
import {AudioFileConversionService} from './AudioFileConversionService'
import {PpsxService} from './PpsxService'
import {TempFolderService} from './TempFolderService'

export class MainService {
    public static getInstance(): MainService {
        return new MainService(
            new PpsxService(),
            GoogleCloudSpeechToTextClient.getInstance(),
            new TempFolderService(),
            new AudioFileConversionService()
        )
    }
    constructor(
        private readonly ppsxService: PpsxService,
        private readonly googleSpeechToTextClient: GoogleCloudSpeechToTextClient,
        private readonly tempFolderService: TempFolderService,
        private readonly audioFileConversionService: AudioFileConversionService
    ) {}

    public async transcribePpsx(ppsxFilePath: string): Promise<string> {
        let tempFolder: string | null = null
        try {
            tempFolder = await this.tempFolderService.createNewTempFolder()
            const extractedAudioFiles = (
                await this.ppsxService.extractAudioFiles(ppsxFilePath, tempFolder)
            ).sort((a, b) => {
                return this.parseSlideNumberFromFilePath(a) - this.parseSlideNumberFromFilePath(b)
            })
            const audioFileTranscriptions: string[] = await Promise.all(
                extractedAudioFiles.map(async a => {
                    const convertedAudioFile = await this.audioFileConversionService.convertM4aToWav(
                        a,
                        tempFolder!
                    )
                    const transcription = await this.googleSpeechToTextClient.transcribeWavAudioFile(
                        convertedAudioFile
                    )
                    return `Slide ${this.parseSlideNumberFromFilePath(a)}:\n${transcription}`
                })
            )
            return audioFileTranscriptions.join('\n\n-----\n\n') + '\n'
        } finally {
            if (tempFolder !== null) {
                await this.tempFolderService.removeTempFolderRecursively(tempFolder)
            }
        }
    }

    public async savePpsxTranscription(
        ppsxFilePath: string,
        transcription: string
    ): Promise<string> {
        const transcriptionFilePath = path.join(
            path.dirname(ppsxFilePath),
            `${path.basename(ppsxFilePath, '.ppsx')}-transcription.txt`
        )
        await fsPromises.writeFile(transcriptionFilePath, transcription)
        return transcriptionFilePath
    }

    private parseSlideNumberFromFilePath(filePath: string): number {
        const fileName = path.basename(filePath, '.m4a')
        return Number(fileName.substr('media'.length))
    }
}
