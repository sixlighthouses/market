
export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Welcome to our blog! Stay tuned for updates.
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold mb-6 text-card-foreground">Latest Posts</h2>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground">
          <li>Post 1: Introduction to Our Project</li>
          <li>Post 2: Exploring the Tech Stack</li>
          <li>Post 3: Building with React and FastAPI</li>
        </ul>
      </div>
    </div>
  )
}