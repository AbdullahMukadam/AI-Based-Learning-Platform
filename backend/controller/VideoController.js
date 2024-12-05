import cloudinary from '../config/cloudinary.js';
import Course from '../models/Course.js';

export const uploadLessonVideo = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No video file provided"
            });
        }

        // Verify course exists and user has permission
        const course = await Course.findById(courseId);
        if (!course) {
            // Delete uploaded file if course not found
            if (req.file.path) {
                await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
            }
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            // Delete uploaded file if lesson not found
            if (req.file.path) {
                await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
            }
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        // If lesson already has a video, delete the old one
        if (lesson.videoUrl) {
            const oldPublicId = lesson.videoUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'video' });
        }

        // Update lesson with new video URL
        lesson.videoUrl = req.file.path;
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            videoUrl: req.file.path
        });

    } catch (error) {
        // Clean up uploaded file in case of error
        if (req.file?.path) {
            try {
                await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'video' });
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        
        console.error('Video upload error:', error);
        return res.status(500).json({
            success: false,
            message: "Error uploading video",
            error: error.message
        });
    }
};

export const deleteVideo = async (req, res) => {
    try {
        const { courseId, lessonId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const lesson = course.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        if (!lesson.videoUrl) {
            return res.status(400).json({
                success: false,
                message: "No video found to delete"
            });
        }

        try {
            // Extract public_id from Cloudinary URL
            const publicId = lesson.videoUrl.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
            // Continue with database update even if Cloudinary deletion fails
        }

        // Remove video URL from lesson
        lesson.videoUrl = '';
        await course.save();

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully"
        });

    } catch (error) {
        console.error('Video deletion error:', error);
        return res.status(500).json({
            success: false,
            message: "Error deleting video",
            error: error.message
        });
    }
}; 