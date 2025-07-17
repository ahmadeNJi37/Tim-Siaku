import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/Components/ui/sheet";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/Components/ui/table";
import { IconEye } from "@tabler/icons-react";

export default function Detail({ schedules, name }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="purple" size="sm">
                    <IconEye className="text-white size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent side="top" className="max-h-[90vh] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Detail KRS Mahasiswa {name}</SheetTitle>
                    <SheetDescription>
                        Detail kartu rencana studi mahasiswa yang diajukan
                    </SheetDescription>
                </SheetHeader>
                <Table className="w-full mt-4">
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
                        {schedules?.length > 0 ? (
                            schedules.map((schedule, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{schedule.course?.name ?? '-'}</TableCell>
                                    <TableCell>{schedule.course?.credit ?? '-'}</TableCell>
                                    <TableCell>{schedule.classroom?.name ?? '-'}</TableCell>
                                    <TableCell>{schedule.academicYear?.name ?? '-'}</TableCell>
                                    <TableCell>
                                        {schedule.day_of_week}, {schedule.start_time?.slice(0,5)} - {schedule.end_time?.slice(0,5)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    Tidak ada jadwal
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </SheetContent>
        </Sheet>
    );
}
