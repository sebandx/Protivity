import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
        publishYear: {
            type: Number,
            required: true,
        },
        dateAdded: { // new field for the date
            type: Date,
            default: Date.now // automatically set to the current date
        }
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model('Cat', bookSchema);
