import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { IconChecklist } from "@tabler/icons-react";
import { toast } from "sonner";

export default function Approve({ name, statuses, action }) {
    const { data, setData, put, errors, processing } = useForm({
        status: 'pending',
        notes: '',
        _method: 'PUT',
    });

    const onHandleSubmit = (e) => {
        e.preventDefault();
        put(action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success(`KRS mahasiswa ${name} berhasil diperbarui`);
            },
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="green" size="sm">
                    <IconChecklist className="text-white size-4" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Setujui KRS Mahasiswa {name}</SheetTitle>
                    <SheetDescription>
                        Periksa Kartu Rencana Studi mahasiswa sebelum menyetujui atau menolak.
                    </SheetDescription>
                </SheetHeader>
                <form className="mt-6 space-y-4" onSubmit={onHandleSubmit}>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status, index) => (
                                    <SelectItem key={index} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {data.status === 'reject' && (
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="notes">Keterangan</Label>
                            <Textarea
                                name="notes"
                                id="notes"
                                onChange={(e) => setData(e.target.name, e.target.value)}
                                placeholder="Masukkan catatan..."
                                value={data.notes}
                            />
                        </div>
                    )}

                    <Button type="submit" variant="orange" disabled={processing}>
                        Simpan
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
