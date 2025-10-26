
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBlog } from '../context/BlogContext'
import { BlogEditor } from '../features/blog/BlogEditor'
import { BlogList } from '../features/blog/BlogList'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Plus, ArrowLeft } from 'lucide-react'

export default function Blog() {
  const { isAuthenticated } = useAuth()
  const { posts, loadPosts, savePost, updatePost, setCurrentPost, currentPost } = useBlog()
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const handleCreatePost = async (postData: { title: string; content: string; published: boolean }) => {
    await savePost(postData)
    setShowEditor(false)
  }

  const handleUpdatePost = async (postData: any) => {
    await updatePost(postData)
    setCurrentPost(null)
    setShowEditor(false)
  }

  const handleEditPost = (post: any) => {
    setCurrentPost(post)
    setShowEditor(true)
  }

  const handleCancelEdit = () => {
    setCurrentPost(null)
    setShowEditor(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Blog</h1>
        <p className="text-xl text-muted-foreground">
          {isAuthenticated
            ? 'Create and manage your blog posts'
            : 'Welcome to our blog! Stay tuned for updates.'
          }
        </p>
      </div>

      {isAuthenticated && (
        <div className="mb-8">
          {!showEditor ? (
            <div className="flex justify-center">
              <Button onClick={() => setShowEditor(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Post
              </Button>
            </div>
          ) : (
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Posts
              </Button>
              <BlogEditor
                post={currentPost}
                onSave={currentPost ? handleUpdatePost : handleCreatePost}
                onCancel={handleCancelEdit}
              />
            </div>
          )}
        </div>
      )}

      {!showEditor && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {isAuthenticated ? 'Your Posts' : 'Latest Posts'}
            </h2>
            <BlogList
              posts={posts}
              onEdit={isAuthenticated ? handleEditPost : undefined}
              showEditButtons={isAuthenticated}
            />
          </Card>
        </div>
      )}
    </div>
  )
}