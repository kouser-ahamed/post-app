import { useQuery, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';
import type { Post, PostsResponse } from '../types';
import { POSTS_QUERY_KEY } from './usePosts';

export const postDetailQueryKey = (id: number) => ['post', id];

export const usePost = (id: number | null) => {
  const queryClient = useQueryClient();

  return useQuery<Post>({
    queryKey: postDetailQueryKey(id ?? 0),
    queryFn: ({ signal }) => {
      if (!id) throw new Error('Post ID is required');
      return postsApi.getPostById(id, signal);
    },
    enabled: typeof id === 'number' && id > 0,
    // Intelligent cache prefill from posts list
    initialData: () => {
      if (!id) return undefined;
      const cachedList = queryClient.getQueryData<PostsResponse>(POSTS_QUERY_KEY);
      return cachedList?.posts.find((p) => p.id === id);
    },
  });
};
