import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import VideoUploader from '../components/VideoUploader';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseResponse, userResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/api/user/courses/${courseId}`, {
                        withCredentials: true
                    }),
                    axios.get('http://localhost:8000/api/user/profile', {
                        withCredentials: true
                    })
                ]);

                if (courseResponse.data.success) {
                    setCourse(courseResponse.data.course);
                    if (courseResponse.data.course.lessons?.length > 0) {
                        setCurrentLesson(courseResponse.data.course.lessons[0]);
                    }
                }

                if (userResponse.data.success) {
                    setUser(userResponse.data.user);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setError(error.response?.data?.message || 'Error loading course details');
                toast.error(error.response?.data?.message || 'Error loading course details');
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, navigate]);

    const handleVideoUploadSuccess = (videoUrl) => {
        const updatedCourse = { ...course };
        const lesson = updatedCourse.lessons.find(l => l._id === currentLesson._id);
        if (lesson) {
            lesson.videoUrl = videoUrl;
            setCourse(updatedCourse);
            setCurrentLesson({ ...currentLesson, videoUrl });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Course not found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center text-indigo-600 hover:text-indigo-800"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </nav>

            {/* Course Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player and Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            {currentLesson ? (
                                <div>
                                    <video
                                        className="w-full aspect-video"
                                        controls
                                        src={currentLesson.videoUrl}
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold">{currentLesson.title}</h3>
                                        <p className="text-gray-600 mt-2">{currentLesson.description}</p>
                                        
                                        {/* Admin Video Management Section */}
                                        {user?.role === 'admin' && (
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="text-lg font-medium text-gray-900">Video Management</h4>
                                                    {currentLesson.videoUrl && (
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    await axios.delete(
                                                                        `http://localhost:8000/api/user/courses/${course._id}/lessons/${currentLesson._id}/video`,
                                                                        { withCredentials: true }
                                                                    );
                                                                    const updatedLesson = { ...currentLesson, videoUrl: '' };
                                                                    setCurrentLesson(updatedLesson);
                                                                    toast.success('Video deleted successfully');
                                                                } catch (error) {
                                                                    toast.error('Failed to delete video');
                                                                }
                                                            }}
                                                            className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50"
                                                        >
                                                            Delete Video
                                                        </button>
                                                    )}
                                                </div>
                                                <VideoUploader 
                                                    courseId={course._id}
                                                    lessonId={currentLesson._id}
                                                    onUploadSuccess={handleVideoUploadSuccess}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                    <p className="text-gray-500">Select a lesson to start learning</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg p-4">
                            <h3 className="text-lg font-bold mb-4">Course Content</h3>
                            <div className="space-y-2">
                                {course.lessons.map((lesson) => (
                                    <button
                                        key={lesson._id}
                                        onClick={() => setCurrentLesson(lesson)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                                            currentLesson?._id === lesson._id
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{lesson.title}</span>
                                            <span className="text-sm text-gray-500">
                                                {lesson.duration}min
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetail; 