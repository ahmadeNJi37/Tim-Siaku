import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { IconBooks, IconDotsVertical, IconRefresh } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/layouts/AppLayout';

export default function Index(props) {
    // ✅ Destructuring data dengan aman dari props
    const courses = props.courses?.data ?? [];
    const meta = props.courses?.meta ?? {};
    const links = props.courses?.links ?? [];

    const [params, setParams] = useState(
        props.state || { search: '', load: 10, field: '', direction: 'asc' }
    );

    UseFilter({
        route: route('teachers.courses.index'),
        values: params,
        only: ['courses'],
    });

    const onSortable = (field) => {
        setParams((prev) => ({
            ...prev,
            field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting?.title}
                    subtitle={props.page_setting?.subtitle}
                    icon={IconBooks}
                />
            </div>

            <Card>
                <CardHeader className="mb-4 p-0">
                    <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="search..."
                            value={params.search || ''}
                            onChange={(e) =>
                                setParams((prev) => ({
                                    ...prev,
                                    search: e.target.value,
                                }))
                            }
                        />
                        <Select
                            value={String(params.load)}
                            onValueChange={(value) =>
                                setParams((prev) => ({
                                    ...prev,
                                    load: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((number) => (
                                    <SelectItem
                                        key={number}
                                        value={String(number)}
                                    >
                                        {number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="red"
                            onClick={() => setParams(props.state)}
                            size="xl"
                        >
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>
                    <ShowFilter params={params} />
                </CardHeader>

                <CardContent>
                    {courses.length === 0 ? (
                        <EmptyState
                            icon={IconBooks}
                            title="Tidak ada mata kuliah"
                            subtitle="Mulailah dengan menambahkan mata kuliah baru."
                        />
                    ) : (
                        <ul
                            role="list"
                            className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3"
                        >
                            {courses.map((course) => (
                                <li
                                    key={course.id}
                                    className="overflow-hidden border rounded-xl border-secondary"
                                >
                                    <div className="flex items-center justify-between p-6 border-b border-secondary-900/5 gap-x-4 bg-gray-50">
                                        <Link
                                            href={route(
                                                'teachers.courses.show',
                                                [course.id]
                                            )}
                                            className="text-sm font-semibold leading-relaxed text-foreground"
                                        >
                                            {course.name}
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost">
                                                    <IconDotsVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56">
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={route(
                                                                'teachers.courses.show',
                                                                [course.id]
                                                            )}
                                                        >
                                                            Detail
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <dl className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
                                        <div className="flex justify-between py-3 gap-x-4">
                                            <dt className="text-foreground">
                                                Fakultas
                                            </dt>
                                            <dd className="font-medium text-foreground">
                                                {course.faculty?.name ?? '-'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-3 gap-x-4">
                                            <dt className="text-foreground">
                                                Program Studi
                                            </dt>
                                            <dd className="font-medium text-foreground">
                                                {course.department?.name ?? '-'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between py-3 gap-x-4">
                                            <dt className="text-foreground">
                                                SKS
                                            </dt>
                                            <dd className="font-medium text-foreground">
                                                {course.credit ?? '-'}
                                            </dd>
                                        </div>
                                    </dl>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>

                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan{' '}
                        <span className="font-medium text-blue-600">
                            {meta.from ?? 0}
                        </span>{' '}
                        dari{' '}
                        <span className="font-medium text-blue-600">
                            {meta.total ?? 0}
                        </span>{' '}
                        mata kuliah
                    </p>
                    {meta.has_pages && (
                        <div className="overflow-x-auto">
                            <PaginationTable meta={meta} links={links} />
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout>{page}</AppLayout>;
