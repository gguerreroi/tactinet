export function isAuth(request, response, next){
  if (request.isAuthenticated())
  return next()

  return response.redirect('auth')
}

export function isAuthLogin(request, response, next){
  if (request.isAuthenticated())
    return response.redirect('/')

    return next()
}