import api from "@/api/axios";
import { getUserInfo } from "@/function/user";
import { UserInfo } from "@/interface/Type"
import Image from "next/image"
import { useEffect, useState } from "react";

const Navbar = () => {
      const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
       getUserInfo(setUserInfo)
    }, []);
  return (
    <div className=' flex items-center justify-between p-4 ' >
      <div className='flex items-center gap-6 justify-end w-full'>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
          <Image src="/message.png" alt="" width={20} height={20}/>
        </div>
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/notification.png" alt="" width={22} height={22}/>
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-green-500 text-white rounded-full text-xs'>1</div>
        </div>
        <div className='flex flex-col'>
          <span className="text-xs leading-3 font-medium"> 
            {userInfo ? ((userInfo.enseignant?.prenom ?? "") + (userInfo.enseignant?.nom?.[0] ?? "")) : "Chargement..."}
          </span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <Image src="/admin.png" alt="" width={36} height={36} className="rounded-full"/>
      </div>
    </div>
  )
}

export default Navbar