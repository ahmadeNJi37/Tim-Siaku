import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import StudentLayout from '@/Layouts/StudentLayout';
import { formatDateIndo, STUDYPLANSTATUSVARIANT } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    IconArrowsDownUp,
    IconPlus,
    IconRefresh,
    IconEye,
    IconBuilding,
} from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: studyPlans = [], meta = {}, links = [] } = props.studyPlans ?? {};
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
        route: route('students.study-plans.index'),
        values: params,
        only: ['studyPlans'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting.title}
                    subtitle={props.page_setting.subtitle}
                    icon={IconBuilding}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('students.study-plans.create')}>
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button>
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col gap-y-8">
                <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                    <Input
                        className="w-full sm:w-1/4"
                        placeholder="Cari..."
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

                {/* Tabel */}
                {studyPlans.length === 0 ? (
                    <EmptyState
                        icon={IconBuilding}
                        title="Tidak ada kartu rencana studi"
                        subtitle="Mulailah dengan menambahkan kartu rencana studi baru."
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
                                        <span className="ml-2 text-muted-foreground">
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
                                        <span className="ml-2 text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('status')}
                                    >
                                        Status
                                        <span className="ml-2 text-muted-foreground">
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
                                        <span className="ml-2 text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {studyPlans.map((studyPlan, index) => (
                                <TableRow key={studyPlan.id}>
                                    <TableCell>
                                        {index + 1 + (currentPage - 1) * perPage}
                                    </TableCell>
                                    <TableCell>{studyPlan.academicYear?.name ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={STUDYPLANSTATUSVARIANT[studyPlan.status]}>{studyPlan.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {studyPlan.created_at ? formatDateIndo(studyPlan.created_at) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-x-1">
                                            <Button variant="blue" size="sm" asChild>
                                                <Link href={route('students.study-plans.show', studyPlan.id)}>
                                                    <IconEye className="size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Pagination */}
                <div className="flex w-full flex-col items-center justify-between gap-y-2 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan{' '}
                        <span className="font-medium text-blue-600">{meta?.from ?? 0}</span> dari{' '}
                        {meta?.total ?? 0} kartu rencana studi
                    </p>
                    <div className="overflow-x-auto">
                        {meta?.total > meta?.per_page && (
                            <PaginationTable meta={meta} links={links} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <StudentLayout>{page}</StudentLayout>;
