import express from 'express';
import { 
    getBlogs, 
    createBlog, 
    getBlogBySlug, 
    getBlogById, 
    updateBlog, 
    deleteBlog, 
    exportCSV 
} from '../controllers/blogController.js';

const router = express.Router();

router.get('/export', exportCSV);
router.get('/', getBlogs);
router.post('/', createBlog);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

export default router;