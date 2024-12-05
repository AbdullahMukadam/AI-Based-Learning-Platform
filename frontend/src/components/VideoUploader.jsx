import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VideoUploader = ({ courseId, lessonId, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        const maxSize = 100 * 1024 * 1024; // 100MB

        if (!validTypes.includes(file.type)) {
            throw new Error('Please upload MP4, MOV, or AVI files only');
        }

        if (file.size > maxSize) {
            throw new Error('File size must be less than 100MB');
        }
    };

    const handleUpload = async (event) => {
        try {
            setError(null);
            const file = event.target.files[0];
            if (!file) return;

            validateFile(file);

            const formData = new FormData();
            formData.append('video', file);

            setUploading(true);
            setProgress(0);

            const response = await axios.post(
                `http://localhost:8000/api/user/courses/${courseId}/lessons/${lessonId}/video`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    }
                }
            );

            if (response.data.success) {
                toast.success('Video uploaded successfully');
                if (onUploadSuccess) {
                    onUploadSuccess(response.data.videoUrl);
                }
            }
        } catch (error) {
            setError(error.message);
            toast.error(error.response?.data?.message || error.message);
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
            // Only reset progress if upload was successful
            if (!error) {
                setProgress(0);
            }
            // Reset file input
            event.target.value = '';
        }
    };

    return (
        <div className="space-y-4 mt-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Upload a new video for this lesson. This will replace any existing video.
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">MP4, MOV, or AVI (MAX. 100MB)</p>
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="video/mp4,video/quicktime,video/x-msvideo"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            </div>

            {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        Uploading: {progress}%
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoUploader; 