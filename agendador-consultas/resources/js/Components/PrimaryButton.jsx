export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                'inline-flex items-center rounded-md border border-transparent ' +
                'bg-clinical-800 px-4 py-2 text-sm font-semibold text-white ' +
                'shadow-sm transition-colors duration-150 ' +
                'hover:bg-clinical-700 ' +
                'focus:outline-none focus:ring-2 focus:ring-clinical-500 focus:ring-offset-2 ' +
                'active:bg-clinical-900 ' +
                'disabled:cursor-not-allowed disabled:opacity-50 ' +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}