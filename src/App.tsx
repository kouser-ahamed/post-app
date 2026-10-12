import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { PostDetails } from './components/PostDetails';
import { PostList } from './components/PostList';
import { fetchPosts } from './services/api';
import type { Post } from './types';

export const App = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchPosts(controller.signal);

        if (controller.signal.aborted) return;

        setPosts(data.posts);
      } catch (err: unknown) {
        const isAbort =
          controller.signal.aborted ||
          (typeof err === 'object' &&
            err !== null &&
            'name' in err &&
            (err as { name: string }).name === 'AbortError');

        if (isAbort) return;

        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      controller.abort();
    };
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
    );
  };

  const handlePostDeleted = (deletedId: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedId));
    if (selectedPostId === deletedId) {
      setSelectedPostId(null);
    }
  };

  const activePost = posts.find((item) => item.id === selectedPostId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onHomeClick={() => setSelectedPostId(null)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {selectedPostId !== null && activePost ? (
          <PostDetails
            post={activePost}
            onBack={() => setSelectedPostId(null)}
            onUpdatePost={handlePostUpdated}
            onDeletePost={handlePostDeleted}
          />
        ) : (
          <PostList
            posts={posts}
            isLoading={isLoading}
            error={error}
            onSelectPost={(id) => setSelectedPostId(id)}
            onPostCreated={handlePostCreated}
          />
        )}
      </main>
    </div>
  );
};

export default App;
