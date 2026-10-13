import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';

export const POSTS_QUERY_KEY = ['posts'];
export const POSTS_PER_PAGE = 9;

export interface UsePostsResult {
  allPosts: ReturnType<typeof useMemo>;
  filteredPosts: ReturnType<typeof useMemo>;
  paginatedPosts: ReturnType<typeof useMemo>;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  searchInput: string;
  setSearchInput: (value: string) => void;
  debouncedSearch: string;
  clearSearch: () => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePosts = (initialPage = 1, debounceMs = 350) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const [activeTimer, setActiveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (activeTimer) clearTimeout(activeTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(value.trim());
      setCurrentPage(1);
    }, debounceMs);
    setActiveTimer(timer);
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: ({ signal }) => postsApi.getPosts(150, 0, signal),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const allPosts = useMemo(() => data?.posts ?? [], [data?.posts]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearch) return allPosts;
    const q = debouncedSearch.toLowerCase();
    return allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [allPosts, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const clearSearch = () => {
    if (activeTimer) clearTimeout(activeTimer);
    setSearchInput('');
    setDebouncedSearch('');
    setCurrentPage(1);
  };

  return {
    allPosts,
    filteredPosts,
    paginatedPosts,
    totalCount: filteredPosts.length,
    totalPages,
    currentPage,
    setCurrentPage,
    searchInput,
    setSearchInput: handleSearchChange,
    debouncedSearch,
    clearSearch,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
