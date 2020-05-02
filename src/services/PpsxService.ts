import * as decompress from 'decompress'
import * as path from 'path'

export class PpsxService {
    constructor() {}

    private readonly audioFileExtension: string = '.m4a'

    public async extractAudioFiles(ppsxFilePath: string, outputFolder: string): Promise<string[]> {
        const files = await decompress(ppsxFilePath, outputFolder, {
            filter: (file: decompress.File) => {
                return (
                    path.extname(file.path) === this.audioFileExtension &&
                    file.path.startsWith('ppt/media')
                )
            },
        })
        return files.map(f => path.join(outputFolder, f.path))
    }
}
