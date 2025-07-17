import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { useRef } from "react";

export default function CalendarSchedule({ days, schedules, student = null }) {
    const container = useRef(null);
    const containerNew = useRef(null);
    const containerOffset = useRef(null);

    const calculateRowStart = (time) => {
        const [hour, minute] = time.split(':').map(Number); // ✅ Fix: `number` => `Number`
        const adjustedHour = hour > 7 ? hour - 7 : 0;
        return adjustedHour * 12 + Math.floor(minute / 5) + 1;
    };

    const calculateColumnStart = (day) => {
        const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        return daysOfWeek.indexOf(day) + 1;
    };

    const getRandomColor = () => {
        const colors = [
            'bg-gradient-to-b from-red-500 via-red-500 to-red-600',
            'bg-gradient-to-b from-blue-500 via-blue-500 to-blue-600',
            'bg-gradient-to-b from-green-500 via-green-500 to-green-600',
            'bg-gradient-to-b from-orange-500 via-orange-500 to-orange-600',
            'bg-gradient-to-b from-yellow-500 via-yellow-500 to-yellow-600',
            'bg-gradient-to-b from-emerald-500 via-emerald-500 to-emerald-600',
            'bg-gradient-to-b from-sky-500 via-sky-500 to-sky-600',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div ref={container} className="flex-col flex-auto hidden overflow-auto bg-white isolate lg:flex">
            <div style={{ width: '165%' }} className="flex flex-col flex-none max-w-full sm:max-w-none md:max-w-full">
                <div ref={containerNew} className="sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8">
                    <div className="grid grid-cols-7 text-sm leading-6 text-foreground sm:hidden">
                        {days.map((day, index) => (
                            <button key={index} type="button" className="flex flex-col items-center pt-2 pb-3">
                                {day}
                            </button>
                        ))}
                    </div>
                    <div className="hidden grid-cols-7 -mr-px text-sm leading-6 border-gray-100 divide-x divide-gray-100 text-foreground sm:grid">
                        <div className="col-end-1 w-14" />
                        {days.map((day, index) => (
                            <div key={index} className="flex items-center justify-center py-3">
                                <span>{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-auto">
                    <div className="sticky left-0 z-10 flex-none bg-white w-14 ring-1 ring-gray-100" />
                    <div className="grid flex-auto grid-cols-1 grid-rows-1"> {/* ✅ typo: hilang tag 'div' */}

                        {/* Horizontal Lines + Time Labels */}
                        <div
                            className="grid col-start-1 col-end-2 row-start-1 divide-y divide-gray-100"
                            style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
                        >
                            <div ref={containerOffset} className="row-end-1 h-7"></div>
                            {[...Array(11)].map((_, i) => (
                                <div key={i}>
                                    <div className="sticky left-0 z-20 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-foreground">
                                        {`${(7 + i).toString().padStart(2, '0')}.00`}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Vertical Lines */}
                        <div className="hidden grid-cols-7 col-start-1 col-end-2 grid-rows-1 divide-x divide-gray-100 sm:grid sm:grid-cols-7">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className={`col-start-${i + 1} row-span-full`} />
                            ))}
                            <div className="w-8 col-start-8 row-span-full" />
                        </div>

                        {/* Schedule Items */}
                        <ol
                            className="grid grid-cols-1 col-start-1 col-end-2 row-start-1 sm:grid-cols-7 sm:pr-8"
                            style={{ gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr))' }}
                        >
                            {Object.entries(schedules).map(([startTime, daysObj]) =>
                                Object.entries(daysObj).map(([day, schedule]) => {
                                    const rowStart = calculateRowStart(startTime);
                                    const rowEnd = calculateRowStart(schedule.end_time);
                                    const colStart = calculateColumnStart(day);
                                    const bgColor = getRandomColor();

                                    return (
                                        <li
                                            key={`${startTime}-${day}`}
                                            className="relative mt-px flex"
                                            style={{
                                                gridRow: `${rowStart} / ${rowEnd}`,
                                                gridColumnStart: colStart,
                                            }}
                                        >
                                            <Link
                                                href="#"
                                                className={cn('absolute inset-1 flex flex-col overflow-y-auto p-2 text-xs leading-5 rounded-lg group', bgColor)}
                                            >
                                                <p className="order-1 font-semibold text-white">{schedule.course}</p>
                                                <p className="text-white">{startTime} - {schedule.end_time}</p>
                                            </Link>
                                        </li>
                                    );
                                })
                            )}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
