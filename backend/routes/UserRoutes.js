import express from "express"
import { signup, login, logout, getProfile } from "../controller/UserController.js"
import { getRecommendations, updateUserPreferences } from "../controller/RecommendationController.js"
import { verifyToken } from "../middleware/auth.js"
import { getCourseDetails } from "../controller/CourseController.js"
import { uploadVideo, handleUploadError } from '../config/cloudinary.js';
import { uploadLessonVideo, deleteVideo } from '../controller/VideoController.js';
import { isAdmin } from '../middleware/adminAuth.js';

const router = express.Router()

// Auth routes
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/profile", verifyToken, getProfile)

// Recommendation routes
router.get("/recommendations", verifyToken, getRecommendations)
router.put("/preferences", verifyToken, updateUserPreferences)

// Course routes
router.get("/courses/:courseId", verifyToken, getCourseDetails)

// Video upload routes with error handling
router.post(
    "/courses/:courseId/lessons/:lessonId/video",
    verifyToken,
    isAdmin,
    (req, res, next) => {
        uploadVideo(req, res, (err) => {
            if (err) {
                handleUploadError(err, req, res, next);
            } else {
                next();
            }
        });
    },
    uploadLessonVideo
);

router.delete(
    "/courses/:courseId/lessons/:lessonId/video",
    verifyToken,
    isAdmin,
    deleteVideo
);

export default router