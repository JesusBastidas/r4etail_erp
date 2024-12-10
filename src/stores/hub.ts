import crypto from 'crypto-js'

export const encryptDatos = (data: string) => {
    return crypto.AES.encrypt(JSON.stringify(data), import.meta.env.VITE_KEY_APP).toString()
}

export const decryptDatos = (data: string) => {
    return JSON.parse(crypto.AES.decrypt(data, import.meta.env.VITE_KEY_APP).toString(crypto.enc.Utf8))
}

