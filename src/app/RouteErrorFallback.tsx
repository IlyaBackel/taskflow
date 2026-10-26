import { useRouteError } from 'react-router-dom';
import ErrorState from '../components/shared/ErrorState';

export default function RouteErrorFallback() {
    const error = useRouteError();
    const message =
        error instanceof Error ? error.message : 'An unexpected error occurred';

    return (
        <div className=" w-full flex items-center justify-center px-4 bg-primary-bg">
            <ErrorState
                message={message}
                onRetry={() => window.location.reload()}
            />
        </div>
    );
}