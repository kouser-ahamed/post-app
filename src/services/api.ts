import type { Post, PostsResponse } from '../types';

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
