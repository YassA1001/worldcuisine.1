import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { CommunityPost } from '../../types/database';
import Badge from '../ui/Badge';

interface PostCardProps {
  post: CommunityPost & { profiles?: { username: string }; dishes?: { name: string; country_name: string } | null; likeCount: number; userLiked: boolean };
  onLikeToggle: (postId: string) => void;
  index?: number;
}

export default function PostCard({ post, onLikeToggle, index = 0 }: PostCardProps) {
  const { user } = useAuth();
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!user || liking) return;
    setLiking(true);
    if (post.userLiked) {
      await supabase.from('post_likes').delete().eq('user_id', user.id).eq('post_id', post.id);
    } else {
      await supabase.from('post_likes').insert({ user_id: user.id, post_id: post.id });
    }
    onLikeToggle(post.id);
    setLiking(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-56 overflow-hidden group">
        <img
          src={post.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt="Community post"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {post.dishes && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="default">{post.dishes.country_name}</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        {post.dishes && (
          <p className="text-xs text-orange-500 dark:text-orange-400 font-medium mb-1">{post.dishes.name}</p>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{post.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <User size={12} />
            <span>{post.profiles?.username ?? 'Anonymous'}</span>
            <Clock size={12} className="ml-1" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <button
            onClick={handleLike}
            disabled={!user}
            className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
              post.userLiked
                ? 'text-rose-500'
                : 'text-gray-400 dark:text-gray-500 hover:text-rose-500'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <Heart size={16} fill={post.userLiked ? 'currentColor' : 'none'} />
            <span>{post.likeCount}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
