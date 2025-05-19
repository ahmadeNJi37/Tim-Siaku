import StudentLayout from '@/Layouts/StudentLayout';

export default function Dashboard(props) {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center justify-between gap-y-4 lg:flex-row">
                <div>
                    <h3 className="text-xl font-semibold leading-relaxed tracking-tight text-foreground">
                        {props.page_settings.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{props.page_settings.subtitle}</p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure error consectetur et optio enim natus
                    facilis numquam exercitationem excepturi, delectus reprehenderit ipsa magnam dolore provident eum
                    vero repellat officiis mollitia! Consequuntur aut doloremque hic impedit error delectus officiis
                    dolorem, ad, et quasi blanditiis necessitatibus eos, perferendis magni quae! Soluta nam ducimus ex,
                    sit sed laboriosam aliquam at nisi? Temporibus vel amet ea sunt, quia, eius cupiditate tempore,
                    ducimus accusantium veritatis repellendus et?
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title} />;
