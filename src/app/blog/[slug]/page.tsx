import { notFound } from "next/navigation";
interface BlogPost {
  title: string;
  content: string;
}
type paramsType = Promise<{ slug: string }>;

export default async function BlogPost({ params }: { params: paramsType }) {
  const { slug } = await params;
  const API_URL = "https://www.chotuengineer.com";

  const res = await fetch(`${API_URL}/api/blogs/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const post: BlogPost = await res.json();

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
