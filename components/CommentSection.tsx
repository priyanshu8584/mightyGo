import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';

const CommentsSection = ({ serviceId }: { serviceId: Id<'services'> }) => {
  const comments = useQuery(api.comments.getCommentsByService, { serviceId });
  const addComment = useMutation(api.comments.add);
  const { user } = useUser();

  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content) return alert('Comment cannot be empty');
    setLoading(true);
    try {
      await addComment({
        serviceId,
        userId: user?.id as string,
        content,
        rating,
      });
      setContent('');
      setRating(undefined);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {/* Comment Form Always Visible */}
      <div className="space-y-4 mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your review..."
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
          rows={3}
        />
        <input
          type="number"
          value={rating || ''}
          onChange={(e) =>
            setRating(e.target.value ? parseInt(e.target.value) : undefined)
          }
          placeholder="Rating (1-5)"
          min={1}
          max={5}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Comments Section */}
      <div>
        {comments === undefined ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="border p-4 rounded-md bg-white shadow-sm"
              >
                <p className="text-gray-800">{comment.content}</p>
                {comment.rating !== undefined && (
                  <p className="text-yellow-500">Rating: {comment.rating}/5</p>
                )}
                <p className="text-gray-400 text-xs">
                  Posted on{' '}
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
