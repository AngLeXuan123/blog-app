import mongoose, { Schema, models } from "mongoose";

const blogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        },
    },{
        timestamps: true,
    }
);

const Blog = models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;