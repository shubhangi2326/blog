import Blog from '../models/Blog.js';
import { Parser } from 'json2csv';

export const createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
export const getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 5, search = "", category = "", status = "" } = req.query;
        
        let finalQuery = {};

        // Search logic
        if (search) {
            finalQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { authorName: { $regex: search, $options: 'i' } }
            ];
        }

        // Strict Filters
        if (category) finalQuery.category = category;
        if (status) finalQuery.status = status;

        const blogs = await Blog.find(finalQuery)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Blog.countDocuments(finalQuery);

        res.json({ 
            blogs, 
            totalPages: Math.ceil(count / limit), 
            totalRecords: count 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ message: "Blog not found by slug" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportCSV = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        const fields = [
            { label: 'Title', value: 'title' },
            { label: 'Author Name', value: 'authorName' },
            { label: 'Email Address', value: 'email' },
            { label: 'Category', value: 'category' },
            { label: 'Status', value: 'status' },
            { label: 'Tags', value: 'tags' },
            { label: 'Created Date & Time', value: (row) => new Date(row.createdAt).toLocaleString() }
        ];

        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(blogs);

        res.header('Content-Type', 'text/csv');
        res.attachment('Blog_Data_Report.csv');
        return res.send(csv);

    } catch (err) {
        console.error("Export Error:", err);
        res.status(500).json({ error: "Failed to export data" });
    }
};