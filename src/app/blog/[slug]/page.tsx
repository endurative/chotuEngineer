import { notFound } from "next/navigation";
import { use } from "react";

interface BlogPost {
  title: string;
  content: string;
}

interface Props {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const res = await fetch("http://localhost:3000/api/blogs");
  const posts = await res.json();

  return posts.map((post: any) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = params;

  const res = await fetch(`http://localhost:3000/api/blogs/${slug}`, {
    next: { revalidate: 600 }, // Revalidate the page every 10 minutes
  });
  const post: BlogPost = await res.json();

  if (!post) {
    notFound();
  }

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
