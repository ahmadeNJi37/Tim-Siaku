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
import { cn, flashMessage } from "@/lib/utils";
import { Link, useForm } from "@inertiajs/react";
import {
    IconArrowBack,
    IconBuilding,
    IconCheck,
    IconAlertTriangle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";

export default function Create(props) {
    const { data, setData, post, errors, processing, reset } = useForm({
        schedule_id: [],
        _method: props.page_setting.method,
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_setting.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (response) => {
                const flash = flashMessage(response);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    const onHandleReset = () => {
        reset("schedule_id");
    };

    const student = props.student;

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_setting.title}
                    subtitle={props.page_setting.subtitle}
                    icon={IconBuilding}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route("students.study-plans.index")}>
                        <IconArrowBack className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            {!student?.classroom_id && (
                <Alert variant="warning" className="mb-6">
                    <IconAlertTriangle className="size-5 text-yellow-500" />
                    <AlertTitle>Perhatian</AlertTitle>
                    <AlertDescription>
                        Anda belum memiliki kelas. Hanya ditampilkan jadwal yang tidak terikat kelas. 
                        Silakan hubungi operator untuk menetapkan kelas terlebih dahulu.
                    </AlertDescription>
                </Alert>
            )}

            {props.schedules.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                    Tidak ada jadwal tersedia.
                </p>
            ) : (
                <form onSubmit={onHandleSubmit}>
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Hari</TableHead>
                                <TableHead>Jam</TableHead>
                                <TableHead>Kuota</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.schedules.map((schedule, index) => (
                                <TableRow
                                    key={schedule.id}
                                    className={cn(
                                        schedule.taken_quota === schedule.quota &&
                                            "text-red-500"
                                    )}
                                >
                                    <TableCell>
                                        <Checkbox
                                            id={`schedule_id_${schedule.id}`}
                                            name="schedule_id"
                                            checked={data.schedule_id.includes(schedule.id)}
                                            disabled={schedule.taken_quota === schedule.quota}
                                            onChange={(e) => {
                                                const checked = e.target.checked;
                                                if (checked) {
                                                    setData("schedule_id", [
                                                        ...data.schedule_id,
                                                        schedule.id,
                                                    ]);
                                                } else {
                                                    setData(
                                                        "schedule_id",
                                                        data.schedule_id.filter(
                                                            (id) => id !== schedule.id
                                                        )
                                                    );
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>{schedule.course?.name ?? "-"}</TableCell>
                                    <TableCell>{schedule.classroom?.name ?? "-"}</TableCell>
                                    <TableCell>{schedule.day_of_week ?? "-"}</TableCell>
                                    <TableCell>
                                        {schedule.start_time} - {schedule.end_time}
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            schedule.taken_quota === schedule.quota
                                                ? "text-red-500"
                                                : "text-green-500"
                                        )}
                                    >
                                        {schedule.taken_quota} / {schedule.quota}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="flex flex-col gap-2 mt-8 lg:flex-row lg:justify-end">
                        <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            variant="blue"
                            size="xl"
                            disabled={processing}
                        >
                            <IconCheck className="mr-2" />
                            Simpan
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

Create.layout = (page) => (
    <StudentLayout children={page} title={page.props.page_setting.title} />
);
