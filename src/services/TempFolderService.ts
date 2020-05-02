import * as fs from 'fs'
import * as fsExtra from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import * as util from 'util'

export class TempFolderService {
    constructor() {
        this.asyncMkdTemp = util.promisify(fs.mkdtemp)
        this.tmpdirBasePath = path.join(os.tmpdir(), 'powerpoint-show-transcriber-')
    }

    private readonly asyncMkdTemp: (prefix: string) => Promise<string>
    private readonly tmpdirBasePath: string

    public async createNewTempFolder(): Promise<string> {
        return await this.asyncMkdTemp(this.tmpdirBasePath)
    }

    public async removeTempFolderRecursively(tempFolderPath: string) {
        await fsExtra.remove(tempFolderPath)
    }
}
