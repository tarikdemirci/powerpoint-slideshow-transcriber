import * as linear16 from 'linear16'
import * as path from 'path'

export class AudioFileConversionService {
    constructor() {}

    public async convertM4aToWav(inputM4aFilePath: string, outputFolder: string): Promise<string> {
        const outputFileName = path.basename(inputM4aFilePath, '.m4a') + '.wav'
        const outputFilePath = path.join(outputFolder, outputFileName)
        await linear16(inputM4aFilePath, outputFilePath)
        return outputFilePath
    }
}
