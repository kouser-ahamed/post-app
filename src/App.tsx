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
    let isIgnored = false;
    const controller = new AbortController();

    const initMasterPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchPosts(150, 0, controller.signal);

        if (!isIgnored && !controller.signal.aborted) {
          setPosts(data.posts);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!isIgnored && !controller.signal.aborted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          setIsLoading(false);
        }
      }
    };

    initMasterPosts();

    return () => {
      isIgnored = true;
      controller.abort();
    };
  }, []);

  const handleHomeClick = () => {
    setSelectedPostId(null);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)),
    );
  };

  const handlePostDeleted = (deletedId: number) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedId));
    if (selectedPostId === deletedId) {
      setSelectedPostId(null);
    }
  };

  const activePost = posts.find((item) => item.id === selectedPostId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onHomeClick={handleHomeClick} />

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
