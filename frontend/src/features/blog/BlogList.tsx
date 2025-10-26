
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Edit, Eye } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

interface BlogListProps {
  posts: BlogPost[]
  onEdit?: (post: BlogPost) => void
  onView?: (post: BlogPost) => void
  showEditButtons?: boolean
}

export function BlogList({ posts, onEdit, onView, showEditButtons = false }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No blog posts yet.</p>
        {showEditButtons && (
          <p className="text-sm text-muted-foreground mt-2">
            Create your first post using the editor above.
          </p>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {new Date(post.createdAt).toLocaleDateString()}
                {post.published && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Published
                  </span>
                )}
              </p>
              <div className="prose prose-sm max-w-none">
                <div
                  className="text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: post.content.length > 200
                      ? post.content.substring(0, 200) + '...'
                      : post.content
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(post)}>
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {showEditButtons && onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}