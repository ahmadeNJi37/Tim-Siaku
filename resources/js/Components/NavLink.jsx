import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, url = '#', title, icon: Icon, ...props }) {
    return (
        <li className="list-none">
            <Link
                {...props}
                href={url}
                className={cn(
                    active ? 'bg-blue-800' : 'hover:bg-blue-800',
                    'mx-4 flex items-center gap-3 rounded-lg p-3 font-medium text-white transition-all',
                    props.className,
                )}
            >
                {Icon && <Icon className="size-6" />}
                {title}
            </Link>
        </li>
    );
}
