import { useState, useEffect, useCallback } from 'react';
import blogService from '../services/blogService';
import { toast } from 'react-toastify';

export const useBlogs = (search, page, category, status) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({ totalPages: 1, totalRecords: 0 });

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await blogService.getAllBlogs(search, page, category, status);
            setBlogs(response.blogs || []);
            setMeta({
                totalPages: response.totalPages || 1,
                totalRecords: response.totalRecords || 0
            });
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [search, page, category, status]);

    const deleteBlogById = useCallback(async (id) => {
        if (window.confirm("Delete this post?")) {
            try {
                await blogService.deleteBlog(id);
                toast.success("Post removed");
                await fetchBlogs();
            } catch (err) {
                console.log(err);
                
                toast.error("Delete failed");
            }
        }
    }, [fetchBlogs]);

    const exportCSV = useCallback(() => {
        blogService.exportToCSV();
    }, []);

    useEffect(() => {
        const executeFetch = async () => {
            await fetchBlogs();
        };
        executeFetch();
    }, [fetchBlogs]);

    return { blogs, loading, meta, deleteBlogById, exportCSV };
};