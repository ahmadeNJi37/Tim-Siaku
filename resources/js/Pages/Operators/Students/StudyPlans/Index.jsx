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
import { Avatar } from '@/Components/ui/avatar';
import { IconArrowLeft, IconArrowsDownUp, IconBuilding, IconCircleKey, IconPencil, IconPlus, IconRefresh, IconTrash, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import Detail from './Detail';
import Approve from './Approve';

export default function Index(props) {
    const { data: studyPlans = [], meta = {}, links = [] } = props.studyPlans ?? {};
    const [params, setParams] = useState(props.state || { search: '', load: 10, field: '', direction: 'asc' });

    const onSortable = (field) => {
        setParams((prev) => ({
            ...prev,
            field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    UseFilter({
        route: route('operators.study-plans.index', props.student),
        values: params,
        only: ['studyPlans'],
    });

    const currentPage = Number(meta.current_page) || 1;
    const perPage = Number(meta.per_page) || 10;

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting.title}
                    subtitle={props.page_setting.subtitle}
                    icon={IconBuilding}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.students.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
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
                            value={params.load.toString()}
                            onValueChange={(value) => setParams((prev) => ({ ...prev, load: value }))}
                        >
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((number) => (
                                    <SelectItem key={number} value={number.toString()}>
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
                                            onClick={() => onSortable('id')}
                                        >
                                            #
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('student_number')}
                                        >
                                            Nomor Pokok Mahasiswa
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
                                            Tahun Akademik
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
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
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="group inline-flex"
                                            onClick={() => onSortable('notes')}
                                        >
                                            Catatan
                                            <span className="ml-2 flex-none rounded text-muted-foreground">
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
                                {studyPlans.map((studyPlan, index) => (
                                    <TableRow key={studyPlan.id}>
                                        <TableCell>{index + 1 + (currentPage - 1) * perPage}</TableCell>
                                        <TableCell>
                                           <div className="flex items-center gap-2">
                                             <Avatar>
                                                <AvatarImage src={studyPlan.student?.avatar} />
                                                <AvatarFallback>{studyPlan.student?.name?.substring(0, 1)}</AvatarFallback>
                                            </Avatar>
                                            <span>{studyPlan.student?.name}</span>
                                           </div>
                                        </TableCell>
                                        <TableCell>{studyPlan.student?.classroom}</TableCell>
                                        <TableCell>{studyPlan.student?.student_number}</TableCell>
                                        <TableCell>{studyPlan.academicYear?.name}</TableCell>
                                        <TableCell>{studyPlan.status}</TableCell>
                                        <TableCell>{studyPlan.notes}</TableCell>
                                        <TableCell>{studyPlan.semester}</TableCell>
                                        <TableCell>{studyPlan.created_at ? formatDateIndo(studyPlan.created_at) : '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                {console.log('Render Detail:', studyPlan.schedules, studyPlan.student?.name)}
                                                <Detail
                                                    schedules={studyPlan.schedules ?? []}
                                                    name={studyPlan.student?.name ?? 'Mahasiswa'}
                                                />
                                                <Approve
                                                    name={studyPlan.student.name}
                                                    statuses={props.statuses}
                                                    action={route('operators.study-plans.approve', [
                                                        props.student,
                                                        studyPlan,
                                                    ])}
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
                        <span className="font-medium text-blue-600">{meta.total ?? 0}</span> kartu rencana studi
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
