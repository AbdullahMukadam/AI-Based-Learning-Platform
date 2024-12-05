import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    interests: [{
        type: String,
        enum: ['AI & ML', 'Programming', 'Data Science', 'Web Development', 'Mobile Development']
    }],
    learningPreferences: {
        preferredDifficulty: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        },
        preferredDuration: {
            type: Number,
            min: 1,
            max: 50,
            default: 10
        }
    },
    coursesInProgress: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        progress: {
            type: Number,
            default: 0
        },
        lastAccessed: {
            type: Date,
            default: Date.now
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema); 