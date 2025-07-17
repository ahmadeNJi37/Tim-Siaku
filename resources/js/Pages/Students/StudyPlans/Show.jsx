import Checkbox from "@/Components/Checkbox";
import HeaderTitle from "@/Components/HeaderTitle";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import StudentLayout from "@/Layouts/StudentLayout";
import { STUDYPLANSTATUS, STUDYPLANSTATUSVARIANT } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import {
    IconArrowBack,
    IconBuilding,
} from "@tabler/icons-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";

export default function Show(props) {
    const { studyPlan = {}, page_setting = {} } = props;
    const schedules = studyPlan.schedules ?? [];

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={page_setting.title ?? "Detail KRS"}
                    subtitle={page_setting.subtitle ?? ""}
                    icon={IconBuilding}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route("students.study-plans.index")}>
                        <IconArrowBack className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <div className="flex flex-col gap-y-8">
                {studyPlan.status === STUDYPLANSTATUS.REJECT && (
                    <Alert variant="destructive">
                        <AlertDescription>{studyPlan.notes ?? "KRS ditolak"}</AlertDescription>
                    </Alert>
                )}

                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Mata Kuliah</TableHead>
                            <TableHead>SKS</TableHead>
                            <TableHead>Kelas</TableHead>
                            <TableHead>Tahun Ajaran</TableHead>
                            <TableHead>Waktu</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedules.length > 0 ? (
                            schedules.map((schedule, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{schedule.course?.name ?? "-"}</TableCell>
                                    <TableCell>{schedule.course?.credit ?? "-"}</TableCell>
                                    <TableCell>{schedule.classroom?.name ?? "-"}</TableCell>
                                    <TableCell>{schedule.academicYear?.name ?? "-"}</TableCell>
                                    <TableCell>
                                        {(schedule.day_of_week ?? "-")}, {schedule.start_time ?? "-"} - {schedule.end_time ?? "-"}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    Tidak ada jadwal ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex w-full flex-col items-center justify-between py-2 lg:flex-row gap-y-2">
                    <div className="text-sm text-muted-foreground">
                        Tahun Ajaran:{" "}
                        <span className="text-blue-600 font-bold">
                            {studyPlan.academicYear?.name ?? "-"}
                        </span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>Status:</span>
                        <Badge variant={STUDYPLANSTATUSVARIANT[studyPlan.status] ?? "default"}>
                            {studyPlan.status ?? "-"}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = (page) => (
    <StudentLayout children={page} title={page.props.page_setting?.title ?? "Detail KRS"} />
);
