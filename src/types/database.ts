export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Profile>;
      };
      dishes: {
        Row: Dish;
        Insert: Omit<Dish, 'id' | 'created_at'>;
        Update: Partial<Dish>;
      };
      restaurants: {
        Row: Restaurant;
        Insert: Omit<Restaurant, 'id' | 'created_at'>;
        Update: Partial<Restaurant>;
      };
      restaurant_ratings: {
        Row: RestaurantRating;
        Insert: Omit<RestaurantRating, 'id' | 'created_at'>;
        Update: Partial<RestaurantRating>;
      };
      favorites: {
        Row: Favorite;
        Insert: Omit<Favorite, 'id' | 'created_at'>;
        Update: Partial<Favorite>;
      };
      community_posts: {
        Row: CommunityPost;
        Insert: Omit<CommunityPost, 'id' | 'created_at'>;
        Update: Partial<CommunityPost>;
      };
      post_likes: {
        Row: PostLike;
        Insert: Omit<PostLike, 'id' | 'created_at'>;
        Update: Partial<PostLike>;
      };
    };
  };
}

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Dish {
  id: string;
  name: string;
  country_code: string;
  country_name: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prep_time_minutes: number;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  country_code: string;
  cuisine: string;
  address: string;
  latitude: number;
  longitude: number;
  image_url: string;
  price_range: '$' | '$$' | '$$$';
  created_at: string;
}

export interface RestaurantRating {
  id: string;
  user_id: string;
  restaurant_id: string;
  rating: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  dish_id: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  dish_id: string | null;
  image_url: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PostLike {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
