import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, use } from "react";

interface BlogPost {
  title: string;
  content: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
}

// Create a cached fetch function
const fetchBlogPost = cache(async (slug: string) => {
  const API_URL = "https://dashboard.chotuengineer.com";
  const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return (await res.json()) as BlogPost;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const {slug} = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | Your Site Name`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      url: `https://yourdomain.com/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author || "Your Name"],
    },
    alternates: {
      canonical: `https://yourdomain.com/blog/${slug}`,
    },
    keywords: post.tags?.join(", ") || "",
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug} = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
