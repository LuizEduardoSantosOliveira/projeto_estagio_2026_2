import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-white text-white'
                    : 'border-transparent text-clinical-200 hover:border-clinical-300 hover:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}