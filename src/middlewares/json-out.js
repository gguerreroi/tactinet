export const json_out = (Code, Message, Data = null) => {
    return {
        state: {
            Code: Code,
            Message: Message
        },
        data: Data
    }
}