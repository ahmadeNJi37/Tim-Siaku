import { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';

import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
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

import {
    FEESTATUSVARIANT,
    formatDateIndo,
    formatToRupiah,
} from '@/lib/utils';

import {
    IconArrowsDownUp,
    IconRefresh,
    IconMoneybag,
} from '@tabler/icons-react';

export default function Index() {
    const {
        auth: { user },
        academic_year,
        checkFee,
        fee,
        fees = [],
        meta = {},
        links = [],
        page_setting = {},
        state = {},
    } = usePage().props;

    const [params, setParams] = useState({
        ...state,
        load: state.load ?? '10',
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
        route: route('students.fees.index'),
        values: params,
        only: ['fees'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting?.title ?? 'Pembayaran'}
                    subtitle={page_setting?.subtitle ?? ''}
                    icon={IconMoneybag}
                />
            </div>

            {/* Alert Pembayaran */}
            {!checkFee && (
                <Alert variant="orange">
                    <AlertTitle>
                        Periode pembayaran UKT tahun ajaran {academic_year?.name ?? '-'}
                    </AlertTitle>
                    <AlertDescription>
                        Silahkan untuk melakukan pembayaran UKT terlebih dahulu agar anda
                        dapat mengajukan kartu rencana studi.
                    </AlertDescription>
                </Alert>
            )}

            {/* Info UKT Mahasiswa */}
            {((fee && fee.status === 'Sukses') || !fee) && (
                <Card>
                    <CardContent className="p-6 space-y-20">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Nomor Pokok Mahasiswa</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Fakultas</TableHead>
                                    <TableHead>Golongan</TableHead>
                                    <TableHead>Total Tagihan</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{user?.name ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.student_number ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.semester ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.classroom?.name ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.department?.name ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.faculty?.name ?? '-'}</TableCell>
                                    <TableCell>{user?.student?.feeGroup?.group ?? '-'}</TableCell>
                                    <TableCell>{formatToRupiah(user?.student?.feeGroup?.amount) ?? '-'}</TableCell>
                                    <TableCell>
                                        <Button variant="orange">Bayar</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {/* Filter dan Search */}
            <div className="flex flex-col gap-y-8 mt-8">
                <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                    <Input
                        className="w-full sm:w-1/4"
                        placeholder="Cari..."
                        value={params?.search ?? ''}
                        onChange={(e) =>
                            setParams((prev) => ({ ...prev, search: e.target.value }))
                        }
                    />
                    <Select
                        value={params?.load}
                        onValueChange={(e) => setParams({ ...params, load: e })}
                    >
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
                    <Button
                        variant="red"
                        onClick={() => setParams(state)}
                        size="xl"
                    >
                        <IconRefresh className="size-4" />
                        Bersihkan
                    </Button>
                </div>

                <ShowFilter params={params} />

                {/* Tabel Pembayaran */}
                {(fees?.length ?? 0) === 0 ? (
                    <EmptyState
                        icon={IconMoneybag}
                        title="Tidak ada pembayaran"
                        subtitle="Mulailah dengan menambahkan pembayaran."
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
                                        onClick={() => onSortable('fee_code')}
                                    >
                                        Kode Pembayaran
                                        <span className="ml-2 text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('fee_group_id')}
                                    >
                                        Golongan
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
                                        onClick={() => onSortable('semester')}
                                    >
                                        Semester
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
                                        Dibuat Pada
                                        <span className="ml-2 text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.map((fee, index) => (
                                <TableRow key={fee.id}>
                                    <TableCell>{index + 1 + (currentPage - 1) * perPage}</TableCell>
                                    <TableCell>{fee.fee_code ?? '-'}</TableCell>
                                    <TableCell>{fee.feeGroup?.group ?? '-'}</TableCell>
                                    <TableCell>{fee.academicYear?.name ?? '-'}</TableCell>
                                    <TableCell>{fee.semester ?? '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={FEESTATUSVARIANT[fee.status]}>
                                            {fee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {fee.created_at ? formatDateIndo(fee.created_at) : '-'}
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
                        <span className="font-medium text-blue-600">
                            {meta?.from ?? 0}
                        </span>{' '}
                        dari {meta?.total ?? 0} Pembayaran
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
