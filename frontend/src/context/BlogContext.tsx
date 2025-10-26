import { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

export interface BlogPost {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: string
  updatedAt: string
}

interface BlogState {
  posts: BlogPost[]
  currentPost: BlogPost | null
  isLoading: boolean
  error: string | null
}

const BLOG_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_POSTS: 'SET_POSTS',
  ADD_POST: 'ADD_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  SET_CURRENT_POST: 'SET_CURRENT_POST',
  SET_ERROR: 'SET_ERROR',
} as const

type BlogAction =
  | { type: typeof BLOG_ACTIONS.SET_LOADING; payload: boolean }
  | { type: typeof BLOG_ACTIONS.SET_POSTS; payload: BlogPost[] }
  | { type: typeof BLOG_ACTIONS.ADD_POST; payload: BlogPost }
  | { type: typeof BLOG_ACTIONS.UPDATE_POST; payload: BlogPost }
  | { type: typeof BLOG_ACTIONS.DELETE_POST; payload: string }
  | { type: typeof BLOG_ACTIONS.SET_CURRENT_POST; payload: BlogPost | null }
  | { type: typeof BLOG_ACTIONS.SET_ERROR; payload: string | null }

const BlogStateContext = createContext<BlogState | null>(null)
const BlogDispatchContext = createContext<{
  loadPosts: () => Promise<void>
  savePost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePost: (post: BlogPost) => Promise<void>
  deletePost: (id: string) => Promise<void>
  setCurrentPost: (post: BlogPost | null) => void
} | null>(null)

const getInitialState = (): BlogState => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
})

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case BLOG_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    case BLOG_ACTIONS.SET_POSTS:
      return { ...state, posts: action.payload, isLoading: false }
    case BLOG_ACTIONS.ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        isLoading: false
      }
    case BLOG_ACTIONS.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost,
        isLoading: false
      }
    case BLOG_ACTIONS.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost,
        isLoading: false
      }
    case BLOG_ACTIONS.SET_CURRENT_POST:
      return { ...state, currentPost: action.payload }
    case BLOG_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    default:
      return state
  }
}

interface BlogProviderProps {
  children: ReactNode
}

export function BlogProvider({ children }: BlogProviderProps) {
  const [state, dispatch] = useReducer(blogReducer, getInitialState())

  const loadPosts = useCallback(async () => {
    dispatch({ type: BLOG_ACTIONS.SET_LOADING, payload: true })
    try {
      // For now, we'll use localStorage to persist posts
      // In a real app, this would be an API call
      const savedPosts = localStorage.getItem('blogPosts')
      const posts = savedPosts ? JSON.parse(savedPosts) : []
      dispatch({ type: BLOG_ACTIONS.SET_POSTS, payload: posts })
    } catch (error) {
      dispatch({
        type: BLOG_ACTIONS.SET_ERROR,
        payload: 'Failed to load blog posts'
      })
    }
  }, [])

  const savePost = useCallback(async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: BLOG_ACTIONS.ADD_POST, payload: newPost })

    // Save to localStorage
    const currentPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const updatedPosts = [newPost, ...currentPosts]
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
  }, [])

  const updatePost = useCallback(async (post: BlogPost) => {
    const updatedPost = {
      ...post,
      updatedAt: new Date().toISOString(),
    }

    dispatch({ type: BLOG_ACTIONS.UPDATE_POST, payload: updatedPost })

    // Update in localStorage
    const currentPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const updatedPosts = currentPosts.map((p: BlogPost) =>
      p.id === post.id ? updatedPost : p
    )
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
  }, [])

  const deletePost = useCallback(async (id: string) => {
    dispatch({ type: BLOG_ACTIONS.DELETE_POST, payload: id })

    // Remove from localStorage
    const currentPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]')
    const updatedPosts = currentPosts.filter((p: BlogPost) => p.id !== id)
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
  }, [])

  const setCurrentPost = useCallback((post: BlogPost | null) => {
    dispatch({ type: BLOG_ACTIONS.SET_CURRENT_POST, payload: post })
  }, [])

  const value = {
    loadPosts,
    savePost,
    updatePost,
    deletePost,
    setCurrentPost,
  }

  return (
    <BlogStateContext.Provider value={state}>
      <BlogDispatchContext.Provider value={value}>
        {children}
      </BlogDispatchContext.Provider>
    </BlogStateContext.Provider>
  )
}

export function useBlogState() {
  const context = useContext(BlogStateContext)
  if (!context) {
    throw new Error('useBlogState must be used within a BlogProvider')
  }
  return context
}

export function useBlogDispatch() {
  const context = useContext(BlogDispatchContext)
  if (!context) {
    throw new Error('useBlogDispatch must be used within a BlogProvider')
  }
  return context
}

export function useBlog() {
  return {
    ...useBlogState(),
    ...useBlogDispatch(),
  }
}