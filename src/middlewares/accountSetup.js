export const checkAccountSetup = (req, res, next) => {
    if (!req.user.account_setup_completed) {
        return res.redirect('/auth/setup');
    }
    next();
};

export const checkAccountSetupForAnnouncements = (req, res, next) => {
    if (!req.user.account_setup_completed) {
        req.flash('error', 'Please complete your account setup before creating announcements');
        return res.redirect('/auth/setup');
    }
    next();
}; 