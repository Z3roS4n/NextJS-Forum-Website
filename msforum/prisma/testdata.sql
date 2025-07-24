-- Test data for msforum database

-- Insert categories
testdata
INSERT INTO public.category (name, description) VALUES
  ('General', 'Discuss anything'),
  ('Programming', 'All about code'),
  ('News', 'Latest updates');

-- Insert subscriptions
INSERT INTO public.subscriptions (name, description) VALUES
  ('Free', 'Basic access'),
  ('Pro', 'Advanced features');

-- Insert users
INSERT INTO public.userdata (username, user_id, email, idsub, profile_picture) VALUES
  ('alice', 'u1', 'alice@example.com', 1, NULL),
  ('bob', 'u2', 'bob@example.com', 2, NULL),
  ('carol', 'u3', 'carol@example.com', 1, NULL);

-- Insert articles
INSERT INTO public.article (content, user_id, idcat, title) VALUES
  ('Welcome to the forum!', 'u1', 1, 'Welcome!'),
  ('Let''s talk about JavaScript.', 'u2', 2, 'JavaScript Discussion'),
  ('Breaking news: msforum launched!', 'u3', 3, 'Launch News');

-- Insert comments
INSERT INTO public.comment (content, idart, user_id) VALUES
  ('Great to be here!', 1, 'u2'),
  ('I love JS!', 2, 'u1'),
  ('Congrats on the launch!', 3, 'u2');

-- Insert drafts
INSERT INTO public.draft (title, content, date, user_id) VALUES
  ('Draft 1', 'This is a draft.', NOW(), 'u1'),
  ('Draft 2', 'Another draft.', NOW(), 'u2');

-- Insert upvotes for articles
INSERT INTO public.upvote_article (user_id, idart, upvoted) VALUES
  ('u2', 1, true),
  ('u3', 1, true),
  ('u1', 2, true);

-- Insert upvotes for comments
INSERT INTO public.upvote_comment (user_id, idcomment, upvoted) VALUES
  ('u1', 1, true),
  ('u3', 2, true);
