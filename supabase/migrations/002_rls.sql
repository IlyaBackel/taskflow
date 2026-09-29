ALTER TABLE public.boards        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.columns       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;

--profiles
CREATE POLICY "Users can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can create their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

--boards
CREATE POLICY "Users can view their boards and boards they are members of"
    ON public.boards FOR SELECT
    TO authenticated
    USING (
        auth.uid() = owner_id
        OR id IN (SELECT board_id FROM public.board_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can create their own boards"
    ON public.boards FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own boards"
    ON public.boards FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own boards"
    ON public.boards FOR DELETE
    TO authenticated
    USING (auth.uid() = owner_id);

--board_members
CREATE POLICY "Users can view board members"
    ON public.board_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Owners can add members"
    ON public.board_members FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.boards
            WHERE boards.id = board_members.board_id
              AND boards.owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can remove non-owner members"
    ON public.board_members FOR DELETE
    TO authenticated
    USING (
        role <> 'owner'
        AND board_id IN (SELECT id FROM public.boards WHERE owner_id = auth.uid())
    );

--columns
CREATE POLICY "Users can view columns of their boards"
    ON public.columns FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = columns.board_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create columns in their boards"
    ON public.columns FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = columns.board_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update columns in their boards"
    ON public.columns FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = columns.board_id
              AND board_members.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = columns.board_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete columns in their boards"
    ON public.columns FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.board_members
            WHERE board_members.board_id = columns.board_id
              AND board_members.user_id = auth.uid()
        )
    );

--tasks
CREATE POLICY "Users can view tasks in their boards"
    ON public.tasks FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.columns
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE columns.id = tasks.column_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create tasks in their boards"
    ON public.tasks FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.columns
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE columns.id = tasks.column_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update tasks in their boards"
    ON public.tasks FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.columns
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE columns.id = tasks.column_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete tasks in their boards"
    ON public.tasks FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.columns
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE columns.id = tasks.column_id
              AND board_members.user_id = auth.uid()
        )
    );

--comments
CREATE POLICY "Users can view comments in their boards"
    ON public.comments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.columns ON columns.id = tasks.column_id
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE tasks.id = comments.task_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add comments in their boards"
    ON public.comments FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.tasks
            JOIN public.columns ON columns.id = tasks.column_id
            JOIN public.board_members ON board_members.board_id = columns.board_id
            WHERE tasks.id = comments.task_id
              AND board_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own comments"
    ON public.comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);