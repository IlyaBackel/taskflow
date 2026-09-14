import type { Priority } from '../types/task';

export const getPriorityColor = (priority: Priority | string): string => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
        case 'low':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
};