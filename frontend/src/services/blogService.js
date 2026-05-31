import API from './api';

const blogService = {
    getAllBlogs: async (search = "", page = 1, category = "", status = "") => {
        try {
            const response = await API.get(`/blogs?search=${search}&page=${page}&category=${category}&status=${status}`);
            return response.data;
        } catch (error) {
            console.error("Error in getAllBlogs service:", error);
            throw error;
        }
    },
 getBlogBySlug: async (slug) => {
        try {
            const response = await API.get(`/blogs/slug/${slug}`); 
            return response.data;
        } catch (error) {
            console.error(`Error in getBlogBySlug service for slug ${slug}:`, error);
            throw error;
        }
    },
    getBlogById: async (id) => {
        try {
            const response = await API.get(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error in getBlogById service for ID ${id}:`, error);
            throw error;
        }
    },

    createBlog: async (blogData) => {
        try {
            const response = await API.post('/blogs', blogData);
            return response.data;
        } catch (error) {
            console.error("Error in createBlog service:", error);
            throw error;
        }
    },

    updateBlog: async (id, blogData) => {
        try {
            const response = await API.put(`/blogs/${id}`, blogData);
            return response.data;
        } catch (error) {
            console.error(`Error in updateBlog service for ID ${id}:`, error);
            throw error;
        }
    },

    deleteBlog: async (id) => {
        try {
            const response = await API.delete(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error in deleteBlog service for ID ${id}:`, error);
            throw error;
        }
    },

  exportToCSV: () => {
    try {
        window.open(`${API.defaults.baseURL}/blogs/export`);
    } catch (error) {
        console.error("Error in exportToCSV service:", error);
    }
}

};

export default blogService;