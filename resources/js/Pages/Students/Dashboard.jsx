import CardStat from '@/Components/CardStat';
import StudentLayout from '@/Layouts/StudentLayout';
import { IconCheck, IconCreditCard, IconX } from '@tabler/icons-react';

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
                                    <div className='grid gap-4 mb-8 lg:grid-cols-3'>
                                        <CardStat
                                            data={{ 
                                                title: 'Kartu Rencana Study Diterima',
                                                icon: IconCheck,
                                                background: 'text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500',
                                                iconClassName: 'text-white'
                                            }}
                                        >
                                            <div className='text-2xl font-bold'>
                                                {props.count?.study_plans_approved ?? 0}
                                            </div>
                                        </CardStat>
                                        <CardStat
                                            data={{ 
                                                title: 'Kartu Rencana Study Ditolak',
                                                icon: IconX,
                                                background: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500',
                                                iconClassName: 'text-white'
                                            }}
                                        >
                                            <div className='text-2xl font-bold'>
                                                {props.count?.study_plans_reject ?? 0}
                                            </div>
                                        </CardStat>
                                        <CardStat
                                            data={{ 
                                                title: 'Total Pembayaran',
                                                icon: IconCreditCard,
                                                background: 'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-500',
                                                iconClassName: 'text-white'
                                            }}
                                        >
                                            <div className='text-2xl font-bold'>
                                                {props.count?.total_payments ?? 0}
                                            </div>
                                        </CardStat>
                                        </div>
        </div>
    );
}

Dashboard.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title} />;
