export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking admin status",
            error: error.message
        });
    }
}; 