import HeaderTitle from "@/Components/HeaderTitle";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Select,  SelectContent, SelectItem,  SelectTrigger, SelectValue, } from "@/Components/ui/select";
import AppLayout from "@/Layouts/AppLayout";
import { Link, useForm } from "@inertiajs/react";
import { IconArrowLeft, IconCheck, IconSchool, } from "@tabler/icons-react";
import { toast } from "sonner";
import { flashMessage } from "@/lib/utils";
import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";

export default function Create(props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    faculty_id: "",
    name: "",
    code: "",
    method: props.page_setting.method,
  });

  const onHandleChange = (e) => setData(e.target.name, e.target.value);

  const onHandleSubmit = (e) => {
    e.preventDefault();
    post(props.page_setting.action, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (success) => {
        const flash = flashMessage(success);
        if (flash) toast[flash.type](flash.message);
      },
    });
  };

  const onHandleReset = () => reset();

  return (
    <div className="flex flex-col w-full pb-32">
      <div className="flex flex-col items-start justify-between mb-8 gap-y-4 lg:flex-row lg:items-center">
        <HeaderTitle
          title={props.page_setting.title}
          subtitle={props.page_setting.subtitle}
          icon={IconSchool}
        />
        <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
          <Link href={route("admin.departments.index")}>
            <IconArrowLeft className="size-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onHandleSubmit}>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Fakultas */}
              <div className="col-span-full">
                <Label htmlFor="faculty_id">Fakultas</Label>
                <Select
                  value={data.faculty_id}
                  onValueChange={(value) => setData("faculty_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent>
                    {props.faculties.map((faculty) => (
                      <SelectItem key={faculty.value} value={faculty.value}>
                        {faculty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.faculty_id && <InputError message={errors.faculty_id} />}
              </div>

              {/* Nama */}
              <div className="col-span-full">
                <Label htmlFor="name">Nama Program Studi</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={data.name}
                  onChange={onHandleChange}
                  placeholder="Masukkan nama program studi"
                />
                {errors.name && <InputError message={errors.name} />}
              </div>

              {/* Kode */}
              <div className="col-span-full">
                <Label htmlFor="code">Kode Program Studi</Label>
                <Input
                  type="text"
                  name="code"
                  id="code"
                  value={data.code}
                  onChange={onHandleChange}
                  placeholder="Masukkan kode program studi"
                />
                {errors.code && <InputError message={errors.code} />}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-8 lg:flex-row lg:justify-end">
              <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                Reset
              </Button>
              <Button type="submit" variant="blue" size="xl" disabled={processing}>
                <IconCheck />
                Simpan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

Create.layout = (page) => (
  <AppLayout children={page} title={page.props.page_setting.title} />
);
