import 'mocha'

import * as fsExtra from 'fs-extra'
import * as path from 'path'

import {AudioFileConversionService} from '../../src/services/AudioFileConversionService'
import {TempFolderService} from '../../src/services/TempFolderService'
import {expect} from '../expect'
import {TestFixtures} from '../resources/TestFixtures'

describe('PPSX Service', () => {
    const tempFolderService = new TempFolderService()
    const sut = new AudioFileConversionService()
    let tempFolder: string
    beforeEach(async () => {
        tempFolder = await tempFolderService.createNewTempFolder()
    })

    afterEach(async () => {
        await tempFolderService.removeTempFolderRecursively(tempFolder)
    })

    describe('has a method named convertM4aToWav', () => {
        it('which converts .m4a file to .waw file', async () => {
            const expectedWavFileSize = 2796054
            const convertedFilePath = await sut.convertM4aToWav(
                TestFixtures.m4aAudioFilePath(),
                tempFolder
            )
            expect(path.basename(convertedFilePath)).to.equal('media1.wav')
            await expect(fsExtra.stat(convertedFilePath))
                .to.eventually.have.property('size')
                .and.match(new RegExp(expectedWavFileSize.toString()))
        })
    })
})
