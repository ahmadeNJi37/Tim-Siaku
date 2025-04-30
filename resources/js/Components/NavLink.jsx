import { cn } from "@/lib/utils"; // ← perbaikan di sini
import { Link } from "@inertiajs/react";

export default function NavLink({ active = false, url = '#', title, icon: Icon, className, ...props }) {
    return (
        <li>
            <Link
                href={url}
                className={cn(
                    active ? 'bg-blue-800' : 'hover:bg-blue-800',
                    'my-1 flex items-center gap-3 rounded-lg font-medium text-white transition-all',
                    className
                )}
                {...props}
            >
                {Icon && <Icon className="size-6" />}
                <span>{title}</span>
            </Link>
        </li>
    );
}

