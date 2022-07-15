import React from 'react';
import './App.css';
import PostsList from './features/posts/postsLists';
import AddPostForm from './features/posts/AddPostForm';

function App() {
  return (
    <main className="App">
      <AddPostForm />
      <PostsList />
    </main>
  );
}

export default App;
