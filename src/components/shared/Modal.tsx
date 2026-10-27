import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
    onClose: () => void;
    children: ReactNode;
    labelledBy?: string;
}

const FOCUSABLE_SELECTOR =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ onClose, children, labelledBy }: ModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        const dialog = dialogRef.current;
        if (!dialog) return;

        const initialFocusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (initialFocusables.length > 0) {
            initialFocusables[0]?.focus();
        } else {
            dialog.focus();
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== 'Tab') return;

            const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (!first || !last) return;

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = originalOverflow;
            previousFocusRef.current?.focus?.();
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelledBy}
                tabIndex={-1}
                className="w-full max-w-md focus:outline-none"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}