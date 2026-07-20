export async function getUint8Array(file: {
    bytes?(): Promise<Uint8Array>
    arrayBuffer(): Promise<ArrayBuffer>
}): Promise<Uint8Array> {
    if (file.bytes) {
        return file.bytes()
    } else {
        return new Uint8Array(await file.arrayBuffer())
    }
}

export function throwErrorWithCode(msg: string, code: string): never {
    const err = new Error(msg)
    // @ts-expect-error
    err.code = code
    throw err
}
