
export function getCredentials(req) {
    if (req.headers.authorization) {
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        const database = req.headers.database;
        return {Username: username, Password: password, Database: database}
    }else{
        const {Username, Password, Database} = req.session.message.data
        return {Username: Username, Password: Password, Database: Database};
    }
}