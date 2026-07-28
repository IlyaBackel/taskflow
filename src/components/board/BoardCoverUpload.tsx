import { useRef, useState, type ChangeEvent } from 'react';
import { supabase } from '../../services/supabaseClient';

interface BoardCoverUploadProps {
    userId: string;
    onUploadSuccess: (url: string) => void;
}

export default function BoardCoverUpload({ userId, onUploadSuccess }: BoardCoverUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
            alert('Please upload an image (max 5MB)');
            return;
        }

        setUploading(true);
        try {
            const filePath = `boards/${userId}/${Date.now()}.${file.name.split('.').pop()}`;
            const { error } = await supabase.storage
                .from('boards')
                .upload(filePath, file, { upsert: true, contentType: file.type });
            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('boards').getPublicUrl(filePath);
            setPreviewUrl(publicUrl);
            onUploadSuccess(publicUrl);
        } catch {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Board cover preview"
                    className="w-16 h-16 rounded object-cover border border-border-primary"
                />
            )}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1 border border-border-primary rounded-2xl px-3 py-4 text-primary-text disabled:opacity-50"
            />
            {uploading && <span className="text-sm">Uploading...</span>}
        </div>
    );
}