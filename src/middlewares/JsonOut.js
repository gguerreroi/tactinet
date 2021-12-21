export const JsonOut = (Code, Message, Data = null) => {
    return {
        state: {
            Code: Code,
            Message: Message
        },
        data: Data
    }
}