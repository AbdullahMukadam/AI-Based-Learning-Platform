import Course from '../models/Course.js';
import User from '../models/User.js';

export const getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('coursesInProgress.course');
        
        // Get user's interests and preferences
        const userInterests = user.interests;
        const preferredDifficulty = user.learningPreferences.preferredDifficulty;
        
        // Get courses matching user's interests and difficulty
        let recommendedCourses = await Course.find({
            category: { $in: userInterests },
            difficulty: preferredDifficulty,
            _id: { 
                $nin: user.coursesInProgress.map(c => c.course._id) 
            }
        });

        // If not enough recommendations, add courses from other categories
        if (recommendedCourses.length < 6) {
            const additionalCourses = await Course.find({
                difficulty: preferredDifficulty,
                _id: { 
                    $nin: [...user.coursesInProgress.map(c => c.course._id), 
                          ...recommendedCourses.map(c => c._id)]
                }
            }).limit(6 - recommendedCourses.length);

            recommendedCourses = [...recommendedCourses, ...additionalCourses];
        }

        // Add progress information
        const coursesWithProgress = recommendedCourses.map(course => {
            const courseProgress = user.coursesInProgress.find(
                c => c.course._id.toString() === course._id.toString()
            );
            return {
                ...course.toObject(),
                progress: courseProgress ? courseProgress.progress : 0
            };
        });

        return res.status(200).json({
            success: true,
            recommendations: coursesWithProgress
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching recommendations",
            error: error.message
        });
    }
};

export const updateUserPreferences = async (req, res) => {
    try {
        const { interests, preferredDifficulty, preferredDuration } = req.body;
        
        // Validate inputs
        if (!interests || !Array.isArray(interests) || interests.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select at least one interest"
            });
        }

        if (!preferredDifficulty || !['Beginner', 'Intermediate', 'Advanced'].includes(preferredDifficulty)) {
            return res.status(400).json({
                success: false,
                message: "Invalid difficulty level"
            });
        }

        const duration = parseInt(preferredDuration);
        if (isNaN(duration) || duration < 1 || duration > 50) {
            return res.status(400).json({
                success: false,
                message: "Invalid duration"
            });
        }

        // Update user preferences
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                interests,
                learningPreferences: {
                    preferredDifficulty,
                    preferredDuration: duration
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preferences updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Preferences update error:', error);
        return res.status(500).json({
            success: false,
            message: "Error updating preferences",
            error: error.message
        });
    }
}; 