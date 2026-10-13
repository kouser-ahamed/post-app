import { apiClient, BASE_URL } from './client';
import type {
  CreatePostPayload,
  DeletePostResponse,
  Post,
  PostsResponse,
  UpdatePostPayload,
} from '../types';

export const postsApi = {
  getPosts: async (limit = 150, skip = 0, signal?: AbortSignal): Promise<PostsResponse> => {
    return apiClient<PostsResponse>('/posts', {
      params: { limit, skip },
      signal,
    });
  },

  getPostById: async (id: number, signal?: AbortSignal): Promise<Post> => {
    return apiClient<Post>(`/posts/${id}`, { signal });
  },

  createPost: async (payload: CreatePostPayload): Promise<Post> => {
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
      // Graceful fallback for offline / mock creation
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
  },

  updatePost: async (
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
  },

  deletePost: async (id: number): Promise<DeletePostResponse> => {
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
  },
};
