export function isAuth(request, response, next){
  if (request.isAuthenticated())
  return next()

  return response.redirect('/auth')
}

export function isAuthLogin(request, response, next){
  if (request.isAuthenticated())
    return response.redirect('/')

    return next()
}

export function isAuthApi(request, response, next){
  if (request.isAuthenticated())
    return next()

  if (request.headers.authorization || request.headers.authorization.indexOf('Basic ') === 0)
    return next()

    return response.status(401).json({
      state: {
        Code: 401,
        Message: 'Unauthorized'
      }})
}