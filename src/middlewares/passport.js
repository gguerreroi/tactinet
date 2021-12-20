import passport from "passport";
import passportLocal, { Strategy } from "passport-local"

const Passport = passport();

Passport.use(new Strategy(function(username, password, cb){

}));

export default Passport;