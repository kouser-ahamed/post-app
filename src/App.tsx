import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { PostDetails } from './components/PostDetails';
import { PostList } from './components/PostList';
import type { Post } from './types';

export const App = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [postsCache, setPostsCache] = useState<Post[]>([]);

  const handleLoadedPosts = useCallback((loaded: Post[]) => {
    setPostsCache(loaded);
  }, []);

  const activePost = postsCache.find((item) => item.id === selectedPostId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onHomeClick={() => setSelectedPostId(null)} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {selectedPostId !== null ? (
          <PostDetails
            postId={selectedPostId}
            initialPost={activePost}
            onBack={() => setSelectedPostId(null)}
          />
        ) : (
          <PostList
            onSelectPost={(id) => setSelectedPostId(id)}
            onLoadedPosts={handleLoadedPosts}
          />
        )}
      </main>
    </div>
  );
};

export default App;
