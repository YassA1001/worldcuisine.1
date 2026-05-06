import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, Users, BookOpen, Store, Eye } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { CommunityPost } from '../types/database';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Badge from '../components/ui/Badge';

type PostWithMeta = CommunityPost & {
  profiles?: { username: string };
  dishes?: { name: string } | null;
};

type Tab = 'posts' | 'stats';

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ dishes: 0, restaurants: 0, users: 0, posts: 0 });

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      setLoading(true);
      const { data: postsData } = await supabase
        .from('community_posts')
        .select('*, profiles(username), dishes(name)')
        .order('created_at', { ascending: false });
      setPosts(postsData ?? []);

      const [{ count: d }, { count: r }, { count: p }, { count: u }] = await Promise.all([
        supabase.from('dishes').select('*', { count: 'exact', head: true }),
        supabase.from('restaurants').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ dishes: d ?? 0, restaurants: r ?? 0, posts: p ?? 0, users: u ?? 0 });
      setLoading(false);
    };
    fetchAll();
  }, [isAdmin]);

  if (authLoading) return <LoadingSpinner className="min-h-screen" />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const updatePostStatus = async (postId: string, status: 'approved' | 'rejected') => {
    await supabase.from('community_posts').update({ status }).eq('id', postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
  };

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const rejectedPosts = posts.filter(p => p.status === 'rejected');

  const STATUS_COLOR: Record<string, 'warning' | 'success' | 'error'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
            <Shield size={22} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage content and community posts</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'Dishes', value: stats.dishes, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
            { icon: Store, label: 'Restaurants', value: stats.restaurants, color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
            { icon: Users, label: 'Users', value: stats.users, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
            { icon: Eye, label: 'Posts', value: stats.posts, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-1 w-fit mb-6">
          {(['posts'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                tab === t
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Community Posts
              {t === 'posts' && pendingPosts.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {pendingPosts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner className="h-48" />
        ) : (
          <div className="space-y-4">
            {/* Pending first */}
            {[...pendingPosts, ...approvedPosts, ...rejectedPosts].map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={post.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={STATUS_COLOR[post.status]}>{post.status}</Badge>
                      {post.dishes && <span className="text-xs text-orange-500 font-medium">{post.dishes.name}</span>}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">{post.description}</p>
                    <p className="text-xs text-gray-400">
                      by {post.profiles?.username ?? 'Unknown'} · {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {post.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updatePostStatus(post.id, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                      >
                        <CheckCircle2 size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => updatePostStatus(post.id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 text-gray-400">No posts to manage.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
