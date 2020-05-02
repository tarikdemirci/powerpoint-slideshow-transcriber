import 'mocha'

import * as path from 'path'

import {PpsxService} from '../../src/services/PpsxService'
import {TempFolderService} from '../../src/services/TempFolderService'
import {expect} from '../expect'
import {TestFixtures} from '../resources/TestFixtures'

describe('PPSX Service', () => {
    const tempFolderService = new TempFolderService()
    const sut = new PpsxService()
    let tempFolder: string
    beforeEach(async () => {
        tempFolder = await tempFolderService.createNewTempFolder()
    })

    afterEach(async () => {
        await tempFolderService.removeTempFolderRecursively(tempFolder)
    })

    describe('has a method named extractAudioFiles', () => {
        it('which returns extracted audio files in happy path', async () => {
            const result = await sut.extractAudioFiles(TestFixtures.ppsxFile(), tempFolder)
            expect(result).to.have.lengthOf(2)
            expect(result.map(p => path.basename(p))).to.have.members(['media1.m4a', 'media2.m4a'])
        })
    })
})
