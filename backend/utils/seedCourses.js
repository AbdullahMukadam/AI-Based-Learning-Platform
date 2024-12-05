import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const courses = [
    {
        title: "Introduction to Machine Learning",
        description: "Learn the fundamentals of Machine Learning, including supervised and unsupervised learning, model evaluation, and practical applications.",
        thumbnail: "https://example.com/ml-thumbnail.jpg",
        category: "AI & ML",
        difficulty: "Beginner",
        instructor: {
            name: "Dr. Sarah Johnson",
            bio: "AI researcher with 10 years of experience in Machine Learning",
            avatar: "https://example.com/sarah-avatar.jpg"
        },
        topics: [
            "Supervised Learning",
            "Unsupervised Learning",
            "Model Evaluation",
            "Python for ML",
            "Data Preprocessing",
            "Basic Neural Networks"
        ],
        duration: 15,
        lessons: [
            {
                title: "Introduction to Machine Learning Concepts",
                description: "Understanding the basics of ML and its applications",
                videoUrl: "https://example.com/videos/ml-intro.mp4",
                duration: 45, // minutes
                order: 1
            },
            {
                title: "Setting Up Your Development Environment",
                description: "Installing Python, libraries, and required tools",
                videoUrl: "https://example.com/videos/ml-setup.mp4",
                duration: 30,
                order: 2
            },
            // Add more lessons...
        ],
        requirements: [
            "Basic Python programming knowledge",
            "Understanding of basic mathematics",
            "Computer with minimum 8GB RAM"
        ],
        whatYouWillLearn: [
            "Understand core ML concepts",
            "Build and train ML models",
            "Evaluate model performance",
            "Deploy ML models"
        ],
        price: 0 // Free course
    },
    // Add more courses with similar structure...
];

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Course.deleteMany({});
        console.log('Cleared existing courses');

        const createdCourses = await Course.insertMany(courses);
        console.log(`Added ${createdCourses.length} courses`);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedCourses(); 