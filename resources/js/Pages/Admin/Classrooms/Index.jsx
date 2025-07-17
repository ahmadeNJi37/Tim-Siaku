import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/layouts/AppLayout';
import { formatDateIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { IconArrowsDownUp, IconDoor, IconPencil, IconPlus, IconRefresh, IconTrash, IconUsersGroup } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: classrooms = [], meta = {}, links = [] } = props.classrooms ?? {};
    const [params, setParams] = useState({
        ...(props.state ?? {}),
        load: props.state?.load ?? '10',
    });

    const currentPage = Number(meta.current_page) || 1;
    const perPage = Number(meta.per_page) || 10;

    const onSortable = (field) => {
        setParams((prev) => ({
            ...prev,
            field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    UseFilter({
        route: route('admin.classrooms.index'),
        values: params,
        only: ['classrooms'],
    });

    const deleteAction = (url) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(url, {
                onError: (errors) => {
                    alert('Terjadi kesalahan saat menghapus data.');
                    console.error(errors);
                },
            });
        }
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle title={props.page_setting.title} subtitle={props.page_setting.subtitle} icon={IconDoor} />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.classrooms.create')}>
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
                            value={params?.search}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                        />
                        <Select value={params?.load} onValueChange={(e) => setParams({ ...params, load: e })}>
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((number) => (
                                    <SelectItem key={number} value={String(number)}>
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
                    {classrooms.length === 0 ? (
                        <EmptyState
                            icon={IconDoor}
                            title="Tidak ada kelas"
                            subtitle="Mulailah dengan menambahkan kelas baru."
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('name')}
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
                                            onClick={() => onSortable('faculty_id')}
                                        >
                                            Fakultas
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('department_id')}
                                        >
                                            Program Studi
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('academic_year_id')}
                                        >
                                            Tahun Ajaran
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
                                {classrooms.map((classroom, index) => (
                                    <TableRow key={classroom.id}>
                                        <TableCell>{index + 1 + (currentPage - 1) * perPage}</TableCell>
                                        <TableCell>{classroom.faculty?.name ?? '-'}</TableCell>
                                        <TableCell>{classroom.department?.name ?? '-'}</TableCell>
                                        <TableCell>{classroom.academicYear?.name ?? '-'}</TableCell>
                                        <TableCell>{classroom.name ?? '-'}</TableCell>
                                        <TableCell>
                                            {classroom.created_at ? formatDateIndo(classroom.created_at) : '-'}
                                        </TableCell>
                                            <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="purple" size="sm" asChild>
                                                <Link href={route('admin.classroom-students.index', classroom.slug)}>
                                                    <IconUsersGroup className="size-4" />
                                                </Link>
                                                </Button>
                                                <Button variant="blue" size="sm" asChild>
                                                <Link href={route('admin.classrooms.edit', classroom.slug)}>
                                                    <IconPencil className="size-4" />
                                                </Link>
                                                </Button>
                                                <AlertAction
                                                trigger={
                                                    <Button variant="red" size="sm">
                                                    <IconTrash className="size-4" />
                                                    </Button>
                                                }
                                                action={() =>
                                                    deleteAction(route('admin.classrooms.destroy', classroom.slug))
                                                }
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
                        Menampilkan <span className="font-medium text-blue-600">{meta?.from ?? 0}</span> dari{' '}
                        {meta?.total ?? 0} kelas
                    </p>
                    <div className="overflow-x-auto">
                        {meta?.total > meta?.per_page && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout>{page}</AppLayout>;
