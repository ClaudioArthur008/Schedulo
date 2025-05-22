"use client";
import Image from "next/image";
import{
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    {name: "Lun", présent : 12, absent: 4},
    {name: "Mar", présent : 10, absent: 6},
    {name: "Mer", présent : 8, absent: 8}, 
    {name: "Jeu", présent : 15, absent: 1},
    {name: "Ven", présent : 50, absent: 0},
]

const AttendanceChart = () => {
    return (
    <div className="bg-yellow-50 rounded-lg p-4 h-full">
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Présence</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
        </div>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart width={500} height={300} data={data} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd"  />
                <XAxis
                    dataKey="name" 
                    axisLine={false}
                    tick={{ fill: "#000" }}
                    tickLine={false}
                 />
                <YAxis
                    axisLine={false} 
                    tick={{ fill: "#000" }} 
                    tickLine={false}
                />
                <Tooltip
                    contentStyle={{ borderRadius: "10px", borderColor: "dark" }}
                />
                <Legend
                    align="left"
                    verticalAlign="top"
                    wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
                />
                <Bar 
                    dataKey="présent"
                    fill="#22C55E"
                    legendType="circle"
                    radius={[10, 10, 0, 0]}
                />
                <Bar 
                    dataKey="absent"
                    fill="#86EFAC"
                    legendType="circle"
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};
export default AttendanceChart; 