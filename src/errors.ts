export class GoogleCloudSpeechToTextError extends Error {
    constructor(audioFilePath: string, innerError: Error) {
        super(`Unable to transcribe file '${audioFilePath}': ${innerError}`)

        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
        this.stack += '\nCaused by: ' + innerError.stack
    }
}
