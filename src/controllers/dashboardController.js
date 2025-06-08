import announcementService from '../services/announcementService.js';
import Subscriber from '../models/subscriber.js';

// Get dashboard overview
export const index = async (req, res) => {
    try {
        const stats = await announcementService.getAnnouncementStats(req.user._id);
        const subscriberCount = await Subscriber.countDocuments({ customer: req.user._id });

        res.render('dashboard/index', {
            stats: {
                ...stats,
                totalSubscribers: subscriberCount
            },
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        req.flash('error', 'Failed to load dashboard data');
        res.redirect('/dashboard');
    }
};

// Get account settings page
export const account = async (req, res) => {
    try {
        res.render('dashboard/account', {
            user: req.user
        });
    } catch (error) {
        console.error('Error loading account settings:', error);
        req.flash('error', 'Failed to load account settings');
        res.redirect('/dashboard');
    }
};

// Update account settings
export const updateAccount = async (req, res) => {
    try {
        const { org_name, timezone } = req.body;

        // Update user details
        await req.user.updateOne({
            org_name,
            timezone
        });

        req.flash('success', 'Account settings updated successfully');
        res.redirect('/dashboard/account');
    } catch (error) {
        console.error('Error updating account settings:', error);
        req.flash('error', 'Failed to update account settings');
        res.redirect('/dashboard/account');
    }
}; 