import 'mocha'

import {Arg, Substitute, SubstituteOf} from '@fluffy-spoon/substitute'

import {GoogleCloudSpeechToTextClient} from '../../src/clients/GoogleCloudSpeechToTextClient'
import {AudioFileConversionService} from '../../src/services/AudioFileConversionService'
import {MainService} from '../../src/services/MainService'
import {PpsxService} from '../../src/services/PpsxService'
import {TempFolderService} from '../../src/services/TempFolderService'
import {expect} from '../expect'
import {TestFixtures} from '../resources/TestFixtures'

describe('Main Service', () => {
    let mockedPpsxService: SubstituteOf<PpsxService>
    let mockedGoogleCloudSpeechToTextClient: SubstituteOf<GoogleCloudSpeechToTextClient>
    let mockedTempFolderService: SubstituteOf<TempFolderService>
    let mockedAudioFileConversionService: SubstituteOf<AudioFileConversionService>
    let sut: MainService

    beforeEach(() => {
        mockedPpsxService = Substitute.for<PpsxService>()
        mockedGoogleCloudSpeechToTextClient = Substitute.for<GoogleCloudSpeechToTextClient>()
        mockedTempFolderService = Substitute.for<TempFolderService>()
        mockedAudioFileConversionService = Substitute.for<AudioFileConversionService>()

        sut = new MainService(
            mockedPpsxService,
            mockedGoogleCloudSpeechToTextClient,
            mockedTempFolderService,
            mockedAudioFileConversionService
        )
    })
    describe('has a method named transcribePpsx', () => {
        it('which returns transcription for the whole presentation', async () => {
            // Given
            const ppsxFilePath = 'some-ppsx-file-path.ppsx'
            mockedPpsxService
                .extractAudioFiles(Arg.all())
                .returns(
                    Promise.resolve([
                        'media1.m4a',
                        'media2.m4a',
                        'media3.m4a',
                        'media4.m4a',
                        'media5.m4a',
                        'media6.m4a',
                        'media7.m4a',
                        'media8.m4a',
                        'media9.m4a',
                        'media10.m4a',
                        'media11.m4a',
                    ])
                )
            mockedAudioFileConversionService
                .convertM4aToWav(Arg.all())
                .mimicks(async m4aFilePath => {
                    return `${m4aFilePath.split('.')[0]}.wav`
                })

            mockedGoogleCloudSpeechToTextClient
                .transcribeWavAudioFile(Arg.all())
                .mimicks(async wavFilePath => {
                    return `Transcription for ${wavFilePath}`
                })

            const result = await sut.transcribePpsx(ppsxFilePath)
            expect(result).to.equal(await TestFixtures.mockPpsxTranscription())
        })
    })
})
