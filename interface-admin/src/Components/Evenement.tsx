"use client";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
    {
      id: 1,
      title: "Lorem ipsum dolor",
      time: "12:00 PM - 2:00 PM",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      title: "Lorem ipsum dolor",
      time: "12:00 PM - 2:00 PM",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    
];

const Event = () => {
    const [value, onChange] = useState<Value>(new Date());
    return (
        <div className="bg-white p-3 rounded-md">
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">Evenements</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-2">
                {events.map((event) => (
                    <div 
                        key={event.id} 
                        className="p-3 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-green-200 even:border-t-yellow-100"
                    >
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold text-gray-600">{event.title}</h1>
                            <span className="text-gray-400 text-xs">{event.time}</span>
                        </div>
                        <p className="mt-2 text-gray-500 text-sm">{event.description}</p>
                    </div>
                ))}

            </div>
        </div>
    );
};
export default Event;   