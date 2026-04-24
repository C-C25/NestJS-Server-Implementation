export interface payloadType {
    sub: string,
    email: string,
    type: 'access' | 'refresh'
}