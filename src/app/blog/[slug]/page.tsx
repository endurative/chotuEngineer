import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
const author = "Chotu Engineer";
const web_url = "https://chotuengineer.com";
interface BlogPost {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
}

export async function generateStaticParams() {
  return [];
}

const fetchBlogPost = cache(async (slug: string) => {
  const API_URL = process.env.NODE_ENV === "production" ? "https://backend-ce.vercel.app/api" : "http://localhost:3001/api";
  const res = await fetch(`${API_URL}/blog/${slug}`);
  if (!res.ok) return null;
  return (await res.json()) as BlogPost;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.metaTitle} | ${author} `,
    description: post.metaDescription,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: `${web_url}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: author,
    },
    alternates: {
      canonical: `${web_url}/blog/${slug}`,
    },
    keywords: post.tags?.join(", ") || "",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle,
    description: post.metaDescription,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${web_url}/blog/${slug}`,
    },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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
