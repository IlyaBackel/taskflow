import { QueryClient } from '@tanstack/react-query';
import { notifyError } from '../utils/toast';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: (err) => {
                notifyError(err, 'Request failed');
            },
        },
    },
});