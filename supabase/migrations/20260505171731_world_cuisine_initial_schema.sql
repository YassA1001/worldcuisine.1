/*
  # World Cuisine – Initial Schema

  1. New Tables
    - `dishes` – stores all world dishes with ingredients and instructions
    - `restaurants` – simulated nearby restaurants linked to a country
    - `restaurant_ratings` – per-user ratings for restaurants
    - `favorites` – user-saved dishes
    - `community_posts` – user-uploaded photos + descriptions of cooked dishes
    - `post_likes` – which users liked which posts

  2. Security
    - RLS enabled on all tables
    - Authenticated users can read all dishes and restaurants
    - Only owners can manage their own favorites / posts / ratings
    - Admin flag stored in profiles metadata (raw_app_meta_data.role = 'admin')
*/

-- ─── Profiles (public mirror of auth.users) ────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT '',
  avatar_url text DEFAULT '',
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by all authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ─── Dishes ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code text NOT NULL,
  country_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  ingredients jsonb NOT NULL DEFAULT '[]',
  instructions jsonb NOT NULL DEFAULT '[]',
  tags text[] DEFAULT '{}',
  difficulty text NOT NULL DEFAULT 'medium',
  prep_time_minutes int NOT NULL DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dishes viewable by everyone"
  ON dishes FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert dishes"
  ON dishes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update dishes"
  ON dishes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can delete dishes"
  ON dishes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Restaurants ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country_code text NOT NULL,
  cuisine text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  latitude numeric(9,6) NOT NULL DEFAULT 0,
  longitude numeric(9,6) NOT NULL DEFAULT 0,
  image_url text DEFAULT '',
  price_range text NOT NULL DEFAULT '$$',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurants viewable by everyone"
  ON restaurants FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Restaurant Ratings ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurant_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_id uuid NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, restaurant_id)
);

ALTER TABLE restaurant_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings viewable by all authenticated users"
  ON restaurant_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own ratings"
  ON restaurant_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON restaurant_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Favorites ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id uuid NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, dish_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Community Posts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id uuid REFERENCES dishes(id) ON DELETE SET NULL,
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved posts viewable by all"
  ON community_posts FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any post"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Post Likes ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post likes viewable by authenticated users"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_dishes_country_code ON dishes(country_code);
CREATE INDEX IF NOT EXISTS idx_restaurants_country_code ON restaurants(country_code);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
