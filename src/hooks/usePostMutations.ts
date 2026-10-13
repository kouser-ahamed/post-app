import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';
import type {
  CreatePostPayload,
  DeletePostResponse,
  Post,
  PostsResponse,
  UpdatePostPayload,
} from '../types';
import { POSTS_QUERY_KEY } from './usePosts';
import { postDetailQueryKey } from './usePost';

export const usePostMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<Post, Error, CreatePostPayload>({
    mutationFn: (payload) => postsApi.createPost(payload),
    onSuccess: (newPost) => {
      // Intelligently prepend to cached posts list
      queryClient.setQueryData<PostsResponse>(POSTS_QUERY_KEY, (oldData) => {
        if (!oldData) {
          return {
            posts: [newPost],
            total: 1,
            skip: 0,
            limit: 150,
          };
        }
        return {
          ...oldData,
          posts: [newPost, ...oldData.posts],
          total: oldData.total + 1,
        };
      });

      // Also set cache entry for single post
      queryClient.setQueryData(postDetailQueryKey(newPost.id), newPost);
    },
  });

  const updateMutation = useMutation<
    Post,
    Error,
    { id: number; payload: UpdatePostPayload; currentPost?: Post }
  >({
    mutationFn: ({ id, payload, currentPost }) =>
      postsApi.updatePost(id, payload, currentPost),
    onSuccess: (updatedPost) => {
      // Update cached posts list
      queryClient.setQueryData<PostsResponse>(POSTS_QUERY_KEY, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          posts: oldData.posts.map((p) =>
            p.id === updatedPost.id ? { ...p, ...updatedPost } : p,
          ),
        };
      });

      // Update cached single post
      queryClient.setQueryData(postDetailQueryKey(updatedPost.id), updatedPost);
    },
  });

  const deleteMutation = useMutation<DeletePostResponse, Error, number>({
    mutationFn: (id) => postsApi.deletePost(id),
    onSuccess: (_, deletedId) => {
      // Update cached posts list
      queryClient.setQueryData<PostsResponse>(POSTS_QUERY_KEY, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          posts: oldData.posts.filter((p) => p.id !== deletedId),
          total: Math.max(0, oldData.total - 1),
        };
      });

      // Remove single post from cache
      queryClient.removeQueries({ queryKey: postDetailQueryKey(deletedId) });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
