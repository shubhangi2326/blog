import mongoose from "mongoose";

const createSlug = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    authorName: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: String },
    status: { type: String, enum: ["Published", "Draft"], default: "Draft" },
    thumbnailUrl: { type: String },
    shortDescription: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

// Generate a unique slug automatically before validation
BlogSchema.pre("validate", async function () {
  if (this.isModified("title") || !this.slug) {
    const baseSlug = createSlug(this.title || "") || "blog";
    let slug = baseSlug;
    let count = 1;

    while (
      await mongoose.models.Blog.findOne({ slug, _id: { $ne: this._id } })
    ) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
});

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
