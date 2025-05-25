import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TableSearchProps {
  placeholder: string;
}

const TableSearch = ({ placeholder }: TableSearchProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [term, setTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  }, [term]);

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
};

export default TableSearch;
