'use client';

import { useOptimistic, startTransition } from 'react';
import { useState } from 'react';

type Comment = {
  id: number;
  text: string;
  author: string;
};

type Post = {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
};

export default function Test() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Sarah',
      content: 'Just launched my new portfolio website! ',
      likes: 335,
      isLiked: false,
      comments: [
        { id: 1, author: 'Sophia', text: 'Looks amazing!' },
        { id: 2, author: 'Drew', text: 'Love it!' },
      ],
    },
    {
      id: 2,
      author: 'James',
      content: 'Just got my first freelance project! ',
      likes: 543,
      isLiked: false,
      comments: [],
    },
    {
      id: 3,
      author: 'Mike',
      content: 'Started learning React today! ',
      likes: 812,
      isLiked: false,
      comments: [],
    },
    {
      id: 4,
      author: 'Emma',
      content: 'Just finished my first React project! ',
      likes: 432,
      isLiked: false,
      comments: [],
    },
  ]);

  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state: Post[], postId: number) => {
      return state.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      });
    }
  );

  console.log(
    'optimisticPosts',
    optimisticPosts?.map((item) => item?.isLiked)
  );

  const handleLike = async (postId: number) => {
    startTransition(async () => {
      addOptimisticPost(postId);

      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        startTransition(() => {
          setPosts((currentPosts) =>
            currentPosts.map((post) => {
              if (post.id === postId) {
                return {
                  ...post,
                  isLiked: !post.isLiked,
                  likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                };
              }
              return post;
            })
          );
        });

        console.log('Like updated on server');
      } catch (error) {
        console.error('Failed to update like:', error);
      }
    });
  };

  const handleRegularLike = (postId: number) => {
    // Simulate API delay
    setTimeout(() => {
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        })
      );
    }, 1000);
  };

  const handleComment = (postId: number, text: string) => {
    if (!text.trim()) return;

    const commentObj = {
      id: Math.random(),
      author: 'You',
      text,
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, commentObj],
          };
        }
        return post;
      })
    );
  };

  const [newComment, setNewComment] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState<number | null>(
    null
  );

  const renderPost = (post: Post, isOptimistic: boolean) => (
    <div
      key={post.id}
      className='bg-gray-50 rounded-lg shadow-md p-6 space-y-4'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='font-semibold text-lg text-gray-900'>{post.author}</h2>
          <p className='text-gray-700 mt-2'>{post.content}</p>
          {!isOptimistic && (
            <p className='text-2xl text-gray-500 mt-1'>
              (Regular update with 1s delay)
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center space-x-4 pt-3'>
        <form
          action={() =>
            isOptimistic ? handleLike(post.id) : handleRegularLike(post.id)
          }>
          <button
            type='submit'
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              post.isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <span>{post.isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likes}</span>
          </button>
        </form>

        <button
          onClick={() =>
            setActiveCommentPost(activeCommentPost === post.id ? null : post.id)
          }
          className='flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-200 transition-colors'>
          <span>💭</span>
          <span>{post.comments.length}</span>
        </button>
      </div>

      <div className='space-y-4'>
        {post.comments.map((comment) => (
          <div key={comment.id} className='bg-gray-200 rounded-lg p-4'>
            <p className='font-medium text-gray-900'>{comment.author}</p>
            <p className='text-gray-700 mt-1'>{comment.text}</p>
          </div>
        ))}

        {activeCommentPost === post.id && (
          <div className='flex gap-2 mt-4'>
            <input
              type='text'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder='Write a comment...'
              className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={() => {
                handleComment(post.id, newComment);
                setNewComment('');
              }}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-8 bg-blue-100'>
      <h1 className='text-3xl font-bold text-blue-900 mb-8'>D-witter</h1>
      <div className='space-y-6'>
        {optimisticPosts.slice(0, 2).map((post) => renderPost(post, true))}
        {posts.slice(2).map((post) => renderPost(post, false))}
      </div>
    </div>
  );
}
