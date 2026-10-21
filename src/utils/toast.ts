import toast from 'react-hot-toast';

export const notifyError = (err: unknown, fallback = 'Something went wrong') => {
    const message = err instanceof Error ? err.message : fallback;
    toast.error(message);
};

export const notifySuccess = (message: string) => {
    toast.success(message);
};