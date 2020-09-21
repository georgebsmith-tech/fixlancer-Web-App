const PassportLocalStrategy = require("passport-local").Strategy

const bcrypt = require("bcrypt")



function initialize(passport, getUserByName, getUserById) {
    const authenticateuser = async (username, password, done) => {
        const user = await getUserByName(username)
        console.log("The user" + user)
        if (!user) {
            return done(null, false, { message: "invalid username or paaword" })
        }
        try {

            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)

            } else {
                return done(null, false, { message: "invalid username or password" })
            }

        } catch (err) {
            return done(err)
        }

    }
    passport.use(new PassportLocalStrategy({ usernameField: "username", passwordField: "password" }, authenticateuser))
    passport.serializeUser((user, done) => done(null, user.username))
    passport.deserializeUser((username, done) => {
        return done(null, getUserById(username))
    })
}




module.exports = initialize 