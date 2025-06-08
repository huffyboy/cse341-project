export const getLanding = (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.account_setup_completed) {
            return res.redirect('/dashboard');
        } else {
            return res.redirect('/auth/setup');
        }
    }
    res.render('landing');
}; 