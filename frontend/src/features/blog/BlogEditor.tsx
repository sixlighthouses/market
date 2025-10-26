import { useState, useCallback, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface BlogPost {
  id?: string
  title: string
  content: string
  published: boolean
  createdAt?: string
  updatedAt?: string
}

interface BlogEditorProps {
  post?: BlogPost | null
  onSave: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel?: () => void
}

export function BlogEditor({ post, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Update state when post changes
  useEffect(() => {
    setTitle(post?.title || '')
    setContent(post?.content || '')
  }, [post])

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a title for your blog post.',
        variant: 'destructive',
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some content for your blog post.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        published: post?.published ?? false,
      })

      toast({
        title: 'Success',
        description: 'Blog post saved successfully!',
      })

      // Reset form if creating new post
      if (!post) {
        setTitle('')
        setContent('')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save blog post. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [title, content, post, onSave, toast])



  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Enter blog post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content
          </label>
          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              preview="edit"
              hideToolbar={false}
              visibleDragbar={false}
              height={400}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </div>
    </Card>
  )
}