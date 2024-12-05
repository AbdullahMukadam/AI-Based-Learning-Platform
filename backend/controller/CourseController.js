import Course from '../models/Course.js';

export const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        console.error('Error fetching course details:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching course details",
            error: error.message
        });
    }
}; 