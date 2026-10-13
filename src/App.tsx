import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PostsView } from './views/PostsView';
import { PostDetailsView } from './views/PostDetailsView';

export const App = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleHomeClick = () => {
    setSelectedPostId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onHomeClick={handleHomeClick} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {selectedPostId !== null ? (
          <PostDetailsView
            postId={selectedPostId}
            onBack={() => setSelectedPostId(null)}
          />
        ) : (
          <PostsView onSelectPost={(id) => setSelectedPostId(id)} />
        )}
      </main>
    </div>
  );
};

export default App;
