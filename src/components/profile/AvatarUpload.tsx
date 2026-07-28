import { useRef, useState, type ChangeEvent } from 'react';
import { supabase } from '../../services/supabaseClient';
import ProfileAvatar from '../shared/ProfileAvatar';

interface AvatarUploadProps {
    userId: string;
    currentAvatarUrl?: string | null;
    onUploadSuccess: (url: string) => void;
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadSuccess }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file)
        if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
            alert('Please upload an image (max 5MB)');
            return;
        }

        setUploading(true);
        try {
            const filePath = `${userId}/${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true, contentType: file.type });
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setPreviewUrl(publicUrl);
            onUploadSuccess(publicUrl);
        } catch {
            alert('Upload failed');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt="Avatar preview"
                    className="w-16 h-16 rounded-full object-cover border"
                />
            ) : (
                <ProfileAvatar size={50} />
            )}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1 border rounded-2xl px-3 py-4 border-border-primary text-primary-text disabled:opacity-50"
            />
            {uploading && <span className="text-sm">Uploading...</span>}
        </div>
    );
}