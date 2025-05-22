'use client';
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { approuveUser, getUser, User } from "@/function/user";
import { useEffect, useState } from "react";

const UtilisateurPage = () => {
    const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
    useEffect(() => {
        getUser(setUtilisateurs);
    }
    , []);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
           <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-2xl font-semibold">Liste des utilisateurs</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                            <Image src="/filter.png" alt="" width={14} height={14} />
                        </button>
                        <button className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                            <Image src="/sort.png" alt="" width={14} height={14} />
                        </button>
                        <button
                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                            <Image src="/create.png" alt="" width={14} height={14} /> 
                        </button>
                    </div>
                </div>
            </div>

            <table className="w-full mt-4">
                <thead>
                    <tr className="text-left text-gray-500 text-sm">
                        <th className="py-2 px-4">Identifiant</th>
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prénom</th>
                        <th className="py-2 px-4">Statut</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                    {utilisateurs.map((prof, index) => (
                        <tr key={index} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">

                            <td className="py-2 px-4">{prof.id_utilisateur}</td>

                            <td className="py-2 px-4">{prof.email}</td>

                            <td className="py-2 px-4">{prof.role}</td>

                            <td></td>

                            <td></td>
                            
                            <td className="py-2 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                    onClick={async()=>{
                                        await approuveUser(prof.id_utilisateur);
                                    }}
                                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                    <Image src="/edit.png" alt="Modifier" width={20} height={20} />
                                    </button>
                                    <button 
                                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                    <Image src="/delete.png" alt="Supprimer" width={20} height={20} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default UtilisateurPage;