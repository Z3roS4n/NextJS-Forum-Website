-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.account (
  idaccount bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id character varying NOT NULL,
  provider text NOT NULL,
  providerAccountId text NOT NULL,
  access_token text,
  refresh_token text,
  expires_at timestamp without time zone,
  CONSTRAINT account_pkey PRIMARY KEY (idaccount),
  CONSTRAINT account_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.article (
  idart integer NOT NULL DEFAULT nextval('article_idart_seq'::regclass),
  content text NOT NULL,
  user_id character varying NOT NULL,
  idcat integer,
  title character varying NOT NULL,
  datetime timestamp without time zone DEFAULT now(),
  CONSTRAINT article_pkey PRIMARY KEY (idart),
  CONSTRAINT fk_art_cat FOREIGN KEY (idcat) REFERENCES public.category(idcat),
  CONSTRAINT fk_art_user FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.badge_grades (
  idgrade bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  CONSTRAINT badge_grades_pkey PRIMARY KEY (idgrade)
);
CREATE TABLE public.category (
  idcat integer NOT NULL DEFAULT nextval('category_idcat_seq'::regclass),
  name character varying NOT NULL,
  description character varying,
  CONSTRAINT category_pkey PRIMARY KEY (idcat)
);
CREATE TABLE public.comment (
  idcomment integer NOT NULL DEFAULT nextval('comment_idcomment_seq'::regclass),
  content text NOT NULL,
  idart integer NOT NULL,
  user_id character varying NOT NULL,
  datetime timestamp without time zone DEFAULT now(),
  reply_to integer,
  upvotes integer NOT NULL DEFAULT 0,
  CONSTRAINT comment_pkey PRIMARY KEY (idcomment),
  CONSTRAINT comment_idart_fkey FOREIGN KEY (idart) REFERENCES public.article(idart),
  CONSTRAINT comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.draft (
  draftid bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  date timestamp with time zone NOT NULL,
  archived boolean NOT NULL DEFAULT false,
  user_id character varying NOT NULL,
  CONSTRAINT draft_pkey PRIMARY KEY (draftid),
  CONSTRAINT draft_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.notification (
  idnotification bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  seen boolean NOT NULL DEFAULT false,
  type text NOT NULL,
  user_id character varying NOT NULL,
  idart integer,
  mention_author_id character varying,
  CONSTRAINT notification_pkey PRIMARY KEY (idnotification),
  CONSTRAINT notification_mention_author_id_fkey FOREIGN KEY (mention_author_id) REFERENCES public.userdata(user_id),
  CONSTRAINT Notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id),
  CONSTRAINT Notification_idart_fkey FOREIGN KEY (idart) REFERENCES public.article(idart)
);
CREATE TABLE public.session (
  idsession bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id character varying,
  createdAt timestamp without time zone,
  expirestAt timestamp without time zone,
  CONSTRAINT session_pkey PRIMARY KEY (idsession),
  CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.subscriptions (
  idsub integer NOT NULL DEFAULT nextval('subscriptions_idsub_seq'::regclass),
  name character varying NOT NULL,
  description character varying NOT NULL,
  CONSTRAINT subscriptions_pkey PRIMARY KEY (idsub)
);
CREATE TABLE public.upvote_article (
  idupart bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id character varying NOT NULL,
  idart integer NOT NULL,
  upvoted boolean NOT NULL DEFAULT false,
  CONSTRAINT upvote_article_pkey PRIMARY KEY (idupart),
  CONSTRAINT upvote_article_idart_fkey FOREIGN KEY (idart) REFERENCES public.article(idart),
  CONSTRAINT upvote_article_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id)
);
CREATE TABLE public.upvote_comment (
  idupcom bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id character varying NOT NULL,
  idcomment integer NOT NULL,
  upvoted boolean NOT NULL DEFAULT false,
  CONSTRAINT upvote_comment_pkey PRIMARY KEY (idupcom),
  CONSTRAINT upvote_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id),
  CONSTRAINT upvote_idcomment_fkey FOREIGN KEY (idcomment) REFERENCES public.comment(idcomment)
);
CREATE TABLE public.user_badge (
  idbadge bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  obtained_at timestamp with time zone NOT NULL DEFAULT now(),
  idgrade bigint NOT NULL,
  user_id character varying,
  CONSTRAINT user_badge_pkey PRIMARY KEY (idbadge),
  CONSTRAINT user_badge_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.userdata(user_id),
  CONSTRAINT user_badge_idgrade_fkey FOREIGN KEY (idgrade) REFERENCES public.badge_grades(idgrade)
);
CREATE TABLE public.userdata (
  user_id character varying NOT NULL,
  email character varying NOT NULL,
  idsub integer,
  apiToken text NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  username text NOT NULL DEFAULT 'John Doe'::text UNIQUE,
  bio text DEFAULT 'A beautiful msforum user!'::text CHECK (length(bio) <= 256),
  readme text DEFAULT '# 👋 Welcome to your msforum profile!  ⚠️ **No profile README found**  You can customize your public profile by setting up a `README.md` file.  ## How to set it up  1. Go to your **profile page** on msforum. 2. Find the **"README"** section. 3. Click **"Create"** or **"Edit"** to open the Markdown editor. 4. Write your content using **Markdown syntax**. 5. Save your changes — your README will appear here!  📄 A well-crafted README helps others understand who you are and what you''re working on.'::text CHECK (length(readme) <= 1024),
  profile_picture text,
  password text,
  emailVerified timestamp without time zone,
  CONSTRAINT userdata_pkey PRIMARY KEY (user_id),
  CONSTRAINT fk_userdata_subscription FOREIGN KEY (idsub) REFERENCES public.subscriptions(idsub)
);