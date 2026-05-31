import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import blogService from "../services/blogService";
import { toast } from "react-toastify";

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const thumbnail = useWatch({ control, name: "thumbnailUrl" });

  useEffect(() => {
    if (id) {
      blogService.getBlogById(id).then((res) => reset(res));
    }
  }, [id, reset]);

  // Function to handle Image Selection and Convert to Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("thumbnailUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (id) await blogService.updateBlog(id, data);
      else await blogService.createBlog(data);
      toast.success("Blog Published Successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Error saving blog");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      {/* Header Icon */}
      <div className="ui-card p-4 text-center border-bottom-0 rounded-bottom-0 mb-0">
        <div className="bg-navy text-gold d-inline-flex p-3 rounded-circle mb-3 shadow">
          <i className="bi bi-cloud-arrow-up fs-4"></i>
        </div>
        <h4 className="fw-bold text-navy">
          {id ? "Edit Post" : "Create New Post"}
        </h4>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ui-card p-5 rounded-top-0 shadow-lg"
      >
        {/* Section 1: Basic Info */}
        <div className="form-section-title">Basic Information</div>
        <div className="row g-3 mb-4">
          <div>
            <label className="form-label small fw-bold">Title</label>
            <input
              {...register("title", { required: "Title is required" })}
              className={`form-control bg-light ${errors.title ? "is-invalid" : ""}`}
              placeholder="Enter title"
            />
            {errors.title && (
              <span className="text-danger small">{errors.title.message}</span>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">Author Name</label>
            <input
              {...register("authorName", {
                required: "Author name is required",
              })}
              className={`form-control bg-light ${errors.authorName ? "is-invalid" : ""}`}
              placeholder="Enter name"
            />
            {errors.authorName && (
              <span className="text-danger small">
                {errors.authorName.message}
              </span>
            )}
          </div>
          <div className="col-12">
            <label className="form-label small fw-bold">Email Address</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              type="email"
              className={`form-control bg-light ${errors.email ? "is-invalid" : ""}`}
              placeholder="author@example.com"
            />
            {errors.email && (
              <span className="text-danger small">{errors.email.message}</span>
            )}
          </div>
        </div>

        {/* Section 2: Media (CLICK TO UPLOAD) */}
        <div className="form-section-title">Media</div>
        <div className="mb-4">
          <label className="form-label small fw-bold">Post Thumbnail</label>

          {/* Clickable Upload Area */}
          <div
            className="upload-box d-flex flex-column align-items-center justify-content-center p-1"
            onClick={() => fileInputRef.current.click()}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Preview"
                className="img-fluid rounded shadow-sm"
                style={{ maxHeight: "100px" }}
              />
            ) : (
              <>
                <i className="bi bi-image text-muted fs-1 mb-2"></i>
                <p className="m-0 text-muted small">
                  Click here to upload post image
                </p>
                <span className="badge bg-navy text-gold mt-2">
                  Browse Files
                </span>
              </>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <input type="hidden" {...register("thumbnailUrl")} />
        </div>

        {/* Section 3: Classification */}
        <div className="form-section-title">Classification</div>
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <label className="form-label small fw-bold">Category</label>
            <select {...register("category")} className="form-select bg-light">
              <option value="Technology">Technology</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Status</label>
            <select {...register("status")} className="form-select bg-light">
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label small fw-bold">Tags</label>
            <input
              {...register("tags")}
              className="form-control bg-light"
              placeholder="Comma-separated tags"
            />
          </div>
        </div>

        {/* Section 4: Content */}
        <div className="form-section-title">Content</div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Short Description</label>
          <textarea
            {...register("shortDescription")}
            className="form-control bg-light"
            rows="2"
            placeholder="Enter a short description of the blog post..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="form-label small fw-bold">Full Post Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            className={`form-control bg-light ${errors.content ? "is-invalid" : ""}`}
            rows="8"
            placeholder="Write the full content of your blog post here..."
          ></textarea>
          {errors.content && (
            <span className="text-danger small">{errors.content.message}</span>
          )}
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 border-top pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-light px-4 fw-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-navy btn-gold border-0 px-5 fw-bold"
          >
            {id ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
