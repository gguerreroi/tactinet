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

    return response.status(401).json({
      state: {
        Code: 401,
        Message: 'Unauthorized'
      }})
}