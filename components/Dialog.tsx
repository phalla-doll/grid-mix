'use client';

import React, { createContext, useContext, memo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface DialogContextType {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export const Dialog = memo(function Dialog({
    open,
    onOpenChange,
    children,
}: DialogProps) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
});

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('Dialog components must be used within a Dialog');
    }
    return context;
}

interface DialogOverlayProps {
    children?: React.ReactNode;
    className?: string;
}

export const DialogOverlay = memo(function DialogOverlay({
    children,
    className = '',
}: DialogOverlayProps) {
    const { open, onOpenChange } = useDialog();

    if (!open) return null;

    return (
        <div
            className={`fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${className}`}
            onClick={() => onOpenChange(false)}
            onKeyDown={(e) => e.key === 'Escape' && onOpenChange(false)}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
        >
            {children}
        </div>
    );
});

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const DialogContent = memo(function DialogContent({
    children,
    className = '',
    onClick,
}: DialogContentProps) {
    return (
        <div
            className={`w-full max-w-sm sm:max-w-md bg-grid-bg border border-[#222] shadow-2xl flex flex-col ${className}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            role="document"
        >
            {children}
        </div>
    );
});

interface DialogHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogHeader = memo(function DialogHeader({
    children,
    className = '',
}: DialogHeaderProps) {
    return (
        <div
            className={`h-12 border-b border-[#222] flex items-center justify-between px-4 sm:px-6 ${className}`}
        >
            {children}
        </div>
    );
});

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogTitle = memo(function DialogTitle({
    children,
    className = '',
}: DialogTitleProps) {
    return (
        <span
            className={`text-[11px] font-mono text-[#888] tracking-widest uppercase ${className}`}
        >
            {children}
        </span>
    );
});

interface DialogCloseProps {
    onClick?: () => void;
    className?: string;
}

export const DialogClose = memo(function DialogClose({
    onClick,
    className = '',
}: DialogCloseProps) {
    const { onOpenChange } = useDialog();

    return (
        <button
            type="button"
            onClick={onClick || (() => onOpenChange(false))}
            className={`text-[#888] hover:text-white transition-colors ${className}`}
            aria-label="Close dialog"
        >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
        </button>
    );
});

interface DialogBodyProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogBody = memo(function DialogBody({
    children,
    className = '',
}: DialogBodyProps) {
    return (
        <div className={`p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 ${className}`}>
            {children}
        </div>
    );
});

interface DialogFooterProps {
    children: React.ReactNode;
    className?: string;
}

export const DialogFooter = memo(function DialogFooter({
    children,
    className = '',
}: DialogFooterProps) {
    return <div className={`p-4 sm:p-6 pt-0 ${className}`}>{children}</div>;
});
