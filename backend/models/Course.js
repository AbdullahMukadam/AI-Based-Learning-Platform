import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    order: {
        type: Number,
        required: true
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['AI & ML', 'Programming', 'Data Science', 'Web Development', 'Mobile Development']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    instructor: {
        name: {
            type: String,
            required: true
        },
        bio: String,
        avatar: String
    },
    topics: [{
        type: String
    }],
    duration: {
        type: Number, // total duration in hours
        required: true
    },
    lessons: [lessonSchema],
    requirements: [{
        type: String
    }],
    whatYouWillLearn: [{
        type: String
    }],
    price: {
        type: Number,
        required: true,
        default: 0 // 0 for free courses
    }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema); 