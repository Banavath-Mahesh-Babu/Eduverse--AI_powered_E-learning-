import mongoose from 'mongoose'

const Resource = new mongoose.Schema(
    { title: String, url: String },
    { _id: false }
)

const Lesson = new mongoose.Schema(
    { title: String, videoUrl: String, content: String, resources: [Resource] },
    { _id: false }
)

const Course = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { type: String, enum: ['literature', 'business', 'computers'], required: true },
        level: { type: String, default: 'Intermediate' },
        rating: { type: Number, default: 4.6 },
        learners: { type: Number, default: 0 },
        duration: { type: String, default: '6h+' },
        summary: String,
        thesis: String,
        description: String,
        resources: [Resource],
        thumbnail: String,
        lessons: [Lesson],
    },
    { timestamps: true }
)

export const CourseModel = mongoose.model('Course', Course)