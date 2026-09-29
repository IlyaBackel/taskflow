CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


CREATE TABLE IF NOT EXISTS public.boards (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title       text NOT NULL,
    owner_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cover_image text,
    created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.board_members (
    id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id  uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role      text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
    CONSTRAINT board_members_board_id_user_id_key UNIQUE (board_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.columns (
    id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id uuid NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
    title    text NOT NULL,
    position integer NOT NULL DEFAULT 0,
    color    text DEFAULT '#3b83f66e'
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id   uuid NOT NULL REFERENCES public.columns(id) ON DELETE CASCADE,
    title       text NOT NULL,
    description text,
    priority    text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date    date,
    assignee_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    position    integer NOT NULL DEFAULT 0,
    created_by  uuid NOT NULL REFERENCES auth.users(id),
    created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id    uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content    text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name       text,
    email      text,
    avatar_url text
);


CREATE INDEX IF NOT EXISTS idx_board_members_user  ON public.board_members(user_id);
CREATE INDEX IF NOT EXISTS idx_board_members_board ON public.board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_columns_board       ON public.columns(board_id);
CREATE INDEX IF NOT EXISTS idx_tasks_column        ON public.tasks(column_id);
CREATE INDEX IF NOT EXISTS idx_comments_task       ON public.comments(task_id);


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NULL
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET email = NEW.email
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_email_update ON auth.users;
CREATE TRIGGER on_auth_user_email_update
    AFTER UPDATE OF email ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_update();

ALTER PUBLICATION supabase_realtime ADD TABLE public.boards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.board_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.columns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;