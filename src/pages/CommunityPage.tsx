import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Upload, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityPost, Dish } from '../types/database';
import PostCard from '../components/community/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type PostWithMeta = CommunityPost & {
  profiles?: { username: string };
  dishes?: { name: string; country_name: string } | null;
  likeCount: number;
  userLiked: boolean;
};

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>([]);

  // Upload form state
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDish, setSelectedDish] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*, profiles(username), dishes(name, country_name)')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    const { data: likesData } = user
      ? await supabase.from('post_likes').select('post_id').eq('user_id', user.id)
      : { data: [] };

    const { data: allLikes } = await supabase.from('post_likes').select('post_id');
    const userLikedIds = new Set((likesData ?? []).map((l: { post_id: string }) => l.post_id));
    const likeCountMap = (allLikes ?? []).reduce((acc: Record<string, number>, l: { post_id: string }) => {
      acc[l.post_id] = (acc[l.post_id] ?? 0) + 1;
      return acc;
    }, {});

    setPosts((postsData ?? []).map((p) => ({
      ...p,
      likeCount: likeCountMap[p.id] ?? 0,
      userLiked: userLikedIds.has(p.id),
    })));
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [user]);

  useEffect(() => {
    if (showUpload) {
      supabase.from('dishes').select('id, name, country_name').order('name').then(({ data }) => setDishes(data ?? []));
    }
  }, [showUpload]);

  const handleLikeToggle = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, likeCount: p.userLiked ? p.likeCount - 1 : p.likeCount + 1, userLiked: !p.userLiked }
      : p
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageUrl || !description) return;
    setSubmitting(true);
    await supabase.from('community_posts').insert({
      user_id: user.id,
      dish_id: selectedDish || null,
      image_url: imageUrl,
      description,
      status: 'pending',
    });
    setSubmitting(false);
    setSubmitted(true);
    setImageUrl('');
    setDescription('');
    setSelectedDish('');
    setTimeout(() => { setShowUpload(false); setSubmitted(false); }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Users size={22} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
              <p className="text-gray-500 dark:text-gray-400">See what others are cooking around the world</p>
            </div>
          </div>
          {user ? (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors shadow-md"
            >
              <Plus size={18} />
              Share a Dish
            </button>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Lock size={16} />
              Sign in to post
            </Link>
          )}
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No posts yet</h3>
            <p className="text-gray-400 dark:text-gray-500">Be the first to share a dish you cooked!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map((post, i) => (
              <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowUpload(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Upload size={18} className="text-orange-500" />
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Share Your Dish</h2>
                </div>
                <button onClick={() => setShowUpload(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Post submitted!</h3>
                  <p className="text-gray-500 text-sm">Your post is pending review and will appear once approved.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Image URL</label>
                    <input
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/my-dish.jpg"
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Tell us about this dish, how it tasted, what you changed…"
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Related Dish (optional)</label>
                    <select
                      value={selectedDish}
                      onChange={e => setSelectedDish(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
                    >
                      <option value="">Select a dish…</option>
                      {dishes.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.country_name})</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
                  >
                    {submitting ? 'Submitting…' : 'Submit Post'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">Posts are reviewed before appearing publicly.</p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
