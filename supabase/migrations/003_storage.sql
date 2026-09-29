--Бакеты
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('boards', 'boards', true)
ON CONFLICT (id) DO NOTHING;

--avatars
CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

--boards
CREATE POLICY "Anyone can view board covers"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'boards');

CREATE POLICY "Users can upload board covers"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'boards'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update their board covers"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'boards'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );