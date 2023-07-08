
export function is_auth(request, response, next) {

    if (request.isAuthenticated())
            return next()
     
    return response.render('auth')
}

export function is_auth_login(request, response, next) {
    if (request.isAuthenticated())
        return response.redirect('/')

    return next()
}

export function is_auth_api(request, response, next) {

    if (request.isAuthenticated())
        return next()

    if (request.headers.authorization || request.headers.authorization.indexOf('Basic ') === 0)
        return next()

    return response.status(401).json({
        state: {
            Code: 401,
            Message: 'Unauthorized'
        }
    })
}