import Image from "next/image";

const Card = ({type}:{type:string}) => {
    const currentYear = new Date().getFullYear();
    const nextYearShort = (currentYear + 1).toString().slice(-2);
    return (
      <div className="rounded-2xl odd:bg-green-200 even:bg-yellow-100 p-4 flex-1 min-w-[130px]">
          <div className="flex justify-between items-center">
            <span className="text-[12px] bg-white px-2 py-1 rounded-full text-gray-500">
            {currentYear}/{nextYearShort}
            </span>
            <Image src="/more.png" alt="" width={20} height={20} />
          </div>
          <h1 className="text-2xl font-semibold my-4">2525</h1>
          <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
      </div>
    );
};
export default Card;