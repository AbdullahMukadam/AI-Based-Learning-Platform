import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['AI & ML', 'Programming', 'Data Science', 'Web Development', 'Mobile Development'];
const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const PreferencesForm = ({ onSuccess, initialData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            interests: initialData?.interests || [],
            preferredDifficulty: initialData?.learningPreferences?.preferredDifficulty || 'Beginner',
            preferredDuration: initialData?.learningPreferences?.preferredDuration || 10
        }
    });

    const onSubmit = async (data) => {
        try {
            // Ensure interests is an array
            const formattedData = {
                ...data,
                interests: Array.isArray(data.interests) ? data.interests : [data.interests],
                learningPreferences: {
                    preferredDifficulty: data.preferredDifficulty,
                    preferredDuration: parseInt(data.preferredDuration)
                }
            };

            const response = await axios.put('http://localhost:8000/api/user/preferences', formattedData, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success('Preferences updated successfully');
                if (onSuccess) onSuccess(response.data.user);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.error('Preferences update error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interests (Select multiple)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                {...register('interests', {
                                    required: 'Select at least one interest'
                                })}
                                value={category}
                                defaultChecked={initialData?.interests?.includes(category)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-600 break-words">
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.interests && (
                    <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Difficulty Level
                </label>
                <select
                    {...register('preferredDifficulty', {
                        required: 'Please select a difficulty level'
                    })}
                    defaultValue={initialData?.learningPreferences?.preferredDifficulty || 'Beginner'}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {DIFFICULTY_LEVELS.map((level) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>
                {errors.preferredDifficulty && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDifficulty.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Course Duration (hours)
                </label>
                <input
                    type="number"
                    {...register('preferredDuration', {
                        required: 'Please specify preferred duration',
                        min: {
                            value: 1,
                            message: 'Duration must be at least 1 hour'
                        },
                        max: {
                            value: 50,
                            message: 'Duration cannot exceed 50 hours'
                        }
                    })}
                    defaultValue={initialData?.learningPreferences?.preferredDuration || 10}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.preferredDuration && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDuration.message}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Save Preferences
            </button>
        </form>
    );
};

export default PreferencesForm; 