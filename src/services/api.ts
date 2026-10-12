import type {
  CreatePostPayload,
  DeletePostResponse,
  Post,
  PostsResponse,
  UpdatePostPayload,
} from '../types';

const BASE_URL = 'https://dummyjson.com';

export const fetchPosts = async (signal?: AbortSignal): Promise<PostsResponse> => {
  const response = await fetch(`${BASE_URL}/posts`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }
  return response.json();
};

export const fetchPostById = async (id: number, signal?: AbortSignal): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, { signal });
  if (!response.ok) {
    throw new Error(`Failed to load post: ${response.statusText}`);
  }
  return response.json();
};

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/posts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Failed to create post: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    ...data,
    reactions: data.reactions ?? { likes: 0, dislikes: 0 },
    views: data.views ?? 0,
    tags: Array.isArray(data.tags) ? data.tags : [],
  };
};

export const updatePost = async (
  id: number,
  payload: UpdatePostPayload,
  currentPost?: Post,
): Promise<Post> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      return {
        ...(currentPost ?? {
          id,
          title: '',
          body: '',
          tags: [],
          reactions: { likes: 0, dislikes: 0 },
          views: 0,
          userId: 1,
        }),
        ...payload,
        id,
      };
    }

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (currentPost) {
      return {
        ...currentPost,
        ...payload,
        id,
      };
    }
    throw error;
  }
};

export const deletePost = async (id: number): Promise<DeletePostResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 404) {
      return {
        id,
        title: '',
        body: '',
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        userId: 0,
        isDeleted: true,
        deletedOn: new Date().toISOString(),
      };
    }

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`);
    }

    return response.json();
  } catch {
    return {
      id,
      title: '',
      body: '',
      tags: [],
      reactions: { likes: 0, dislikes: 0 },
      views: 0,
      userId: 0,
      isDeleted: true,
      deletedOn: new Date().toISOString(),
    };
  }
};
