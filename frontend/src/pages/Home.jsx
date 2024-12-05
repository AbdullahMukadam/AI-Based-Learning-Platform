import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PreferencesForm from '../components/PreferencesForm';

const Home = () => {
    const [user, setUser] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [showPreferences, setShowPreferences] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [userResponse, recommendationsResponse] = await Promise.all([
                    axios.get('http://localhost:8000/api/user/profile', {
                        withCredentials: true
                    }),
                    axios.get('http://localhost:8000/api/user/recommendations', {
                        withCredentials: true
                    })
                ]);

                if (userResponse.data.success) {
                    setUser(userResponse.data.user);
                }

                if (recommendationsResponse.data.success) {
                    setRecommendations(recommendationsResponse.data.recommendations);
                }
            } catch (error) {
                toast.error('Please login first');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/user/logout', {}, {
                withCredentials: true
            });
            if (response.data.success) {
                toast.success('Logged out successfully');
                navigate('/login');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handlePreferencesUpdate = (updatedUser) => {
        setUser(updatedUser);
        setShowPreferences(false);
        // Refresh recommendations
        fetchUserData();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between h-auto sm:h-16 py-4 sm:py-0 items-center">
                        <div className="flex-shrink-0 mb-4 sm:mb-0">
                            <h1 className="text-xl font-bold text-indigo-600">AI Learning Hub</h1>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Learning Preferences
                            </button>
                            <span className="text-gray-700">Welcome, {user.username}</span>
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Welcome to Your Learning Journey</h2>
                    <p className="text-sm sm:text-base text-gray-600">Personalized recommendations based on your interests and learning style.</p>
                </div>

                {/* Course Recommendations */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Recommended Courses</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommendations.map(course => (
                            <div key={course._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div className="text-sm text-indigo-600 mb-2">{course.category}</div>
                                <h3 className="font-medium text-gray-800 mb-2">{course.title}</h3>
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div className="text-xs text-gray-600">Progress</div>
                                        <div className="text-xs font-semibold text-indigo-600">{course.progress}%</div>
                                    </div>
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                        <div 
                                            style={{ width: `${course.progress}%` }}
                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                        ></div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate(`/course/${course._id}`)}
                                    className="w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Continue Learning
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Learning Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Courses in Progress</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600">3</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Hours Learned</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600">12.5</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">Certificates Earned</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-600">2</p>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
                        <p className="text-sm text-gray-500 mb-4">Are you sure you want to logout?</p>
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPreferences && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Learning Preferences</h3>
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <PreferencesForm 
                            initialData={user} 
                            onSuccess={handlePreferencesUpdate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home; 