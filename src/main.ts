#!/usr/bin/env node
import {MainService} from './services/MainService'

async function main() {
    const mainService = MainService.getInstance()
    if (process.argv.length !== 3) {
        throw new Error('Please provide ppsx file as the only argument!')
    }
    const ppsxFilePath = process.argv[2]
    console.log(`Processing ppsx file: '${ppsxFilePath}'`)
    const transcription = await mainService.transcribePpsx(ppsxFilePath)
    const outputFilePath = await mainService.savePpsxTranscription(ppsxFilePath, transcription)
    console.log(`Transcription saved to: '${outputFilePath}'`)
}

main()
    .then(() => {
        console.log('Success!')
    })
    .catch(err => {
        console.error('Error occurred:')
        console.error(err)
    })
