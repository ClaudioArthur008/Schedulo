import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface TableSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const TableSearch = ({ placeholder, value, onChange }: TableSearchProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
    // eslint-disable-next-line
  }, [value]);

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default TableSearch;
