import type {
  CreatePostPayload,
  DeletePostResponse,
  Post,
  PostsResponse,
  UpdatePostPayload,
} from '../types';

const BASE_URL = 'https://dummyjson.com';

export const fetchPosts = async (
  limit = 150,
  skip = 0,
  signal?: AbortSignal,
): Promise<PostsResponse> => {
  const response = await fetch(`${BASE_URL}/posts?limit=${limit}&skip=${skip}`, {
    signal,
  });
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
  try {
    const response = await fetch(`${BASE_URL}/posts/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        id: data.id ?? Date.now(),
        reactions: data.reactions ?? { likes: 0, dislikes: 0 },
        views: data.views ?? 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    }
  } catch {
    // Graceful fallback to client-generated post
  }

  return {
    id: Date.now(),
    title: payload.title,
    body: payload.body,
    tags: payload.tags,
    userId: payload.userId,
    reactions: { likes: 0, dislikes: 0 },
    views: 0,
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

    if (response.ok) {
      const data = await response.json();
      return {
        ...(currentPost ?? {}),
        ...data,
        ...payload,
        id,
      };
    }
  } catch {
    // Gracefully handle network issues / 404 for simulated IDs
  }

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
};

export const deletePost = async (id: number): Promise<DeletePostResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Gracefully handle network issues / 404 for simulated IDs
  }

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
};
