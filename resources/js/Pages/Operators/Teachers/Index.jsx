import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/layouts/AppLayout';
import { deleteAction, formatDateIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Avatar } from '@radix-ui/react-avatar';
import { IconArrowsDownUp, IconCircleKey, IconPencil, IconPlus, IconRefresh, IconTrash, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {

    const { data: teachers = [], meta = {}, links = [] } = props.teachers ?? {};
    // Inisialisasi params; props.state diharapkan berisi search, load, field, direction
    const [params, setParams] = useState(props.state || { search: '', load: 10, field: '', direction: 'asc' });

    // Sorting handler
    const onSortable = (field) => {
        setParams((prev) => ({
            ...prev,
            field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // Terapkan filter/sort ke URL via Inertia
    UseFilter({
        route: route('operators.teachers.index'),
        values: params,
        only: ['operators'],
    });

    // currentPage dan perPage untuk numbering
    const currentPage = Number(meta.current_page) || 1;
    const perPage = Number(meta.per_page) || 10;

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting.title}
                    subtitle={props.page_setting.subtitle}
                    icon={IconUsersGroup}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.teachers.create')}>
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader className="mb-4 p-0">
                    <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="search..."
                            value={params.search || ''}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                        />
                        <Select
                            value={params.load}
                            onValueChange={(value) => setParams((prev) => ({ ...prev, load: value }))}
                        >
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((number) => (
                                    <SelectItem key={number} value={number}>
                                        {number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="red" onClick={() => setParams(props.state)} size="xl">
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="[&>table td]:whitespace-nowrap [&>table td]:px-6 p-0">
                    {teachers.length === 0 ? (
                        <EmptyState
                            icon={IconUsersGroup}
                            title="Tidak ada dosen"
                            subtitle="Mulailah dengan menambahkan dosen baru."
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('id')}
                                        >
                                            #
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('name')}
                                        >
                                            Nama
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('email')}
                                        >
                                            Email
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                      <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('teacher_number')}
                                        >
                                            Nomor Induk Dosen Nasional
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                      <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('academic_title')}
                                        >
                                             Jabatan Akademik
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('created_at')}
                                        >
                                            Dibuat pada
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.map((teacher, index) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>{index + 1 + (currentPage - 1) * perPage}</TableCell>
                                        <TableCell className='flex items-center gap-2'>
                                            <Avatar>
                                                <AvatarImage src={teacher.user?.avatar}/>
                                                <AvatarFallback>{teacher.user?.name?.substring(0,1)}</AvatarFallback>
                                            </Avatar>
                                            <span>{teacher.user?.name}</span>
                                        </TableCell>
                                        <TableCell>{teacher.user?.email}</TableCell>
                                        <TableCell>{teacher.teacher_number}</TableCell>
                                        <TableCell>{teacher.academic_title}</TableCell>
                                        <TableCell>{teacher.created_at ? formatDateIndo(teacher.created_at) : '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="blue" size="sm" asChild>
                                                    <Link href={route('operators.teachers.edit', teacher.teacher_number)}>
                                                        <IconPencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <AlertAction
                                                    trigger={
                                                        <Button variant="red" size="sm">
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    }
                                                    action={() => deleteAction(route('operators.teachers.destroy', teacher.teacher_number))}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        <span className="font-medium text-blue-600">{meta.total ?? 0}</span> dosen
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout>{page}</AppLayout>;
