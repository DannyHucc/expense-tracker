module.exports = {
    authenticator: async (req, res, next) => {
        try {
            if (req.isAuthenticated()) {
                return next()
            }
            req.flash('warning_msg', 'Please login first!')
            return res.redirect("/users/login")
        } catch (error) {
            return next(error)
        }
    }
}