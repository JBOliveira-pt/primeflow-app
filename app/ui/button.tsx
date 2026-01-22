import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            className={clsx(
                "flex h-10 items-center rounded-lg bg-[#141828] px-4 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141828] active:bg-black aria-disabled:cursor-not-allowed aria-disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white dark:active:bg-slate-300 dark:focus-visible:outline-slate-200",
                className,
            )}
        >
            {children}
        </button>
    );
}
