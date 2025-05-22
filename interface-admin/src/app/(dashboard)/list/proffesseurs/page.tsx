"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import {JSX, useEffect, useState } from "react";
import { Modal } from "antd";
import {getAll, add, update, remove} from "@/function/ensignant";
import DisponibiliteProfesseur from "@/Components/Disponibilite";
import { useRouter } from "next/navigation";
import apilog from '@/api/api'
import { UserInfo } from "@/interface/Type";


const ProffesseursPage = () => {
    interface Matiere {
        id: number;
        nom_matiere: string;
      }
      
      interface Proffesseur {
        id_enseignant: number;
        nom: string;
        prenom: string;

      }
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [proffesseurs, setProffesseurs] = useState<Proffesseur[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [newProf, setNewprof] = useState<Proffesseur>({
        id_enseignant: 0,
        nom: "",
        prenom: ""
    });
    const [expandedProfId, setExpandedProfId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();


     const fetchProfesseurs = async () => {
            try {
                const response = await getAll(token!);
                setProffesseurs(response);
            } catch (error) {
                console.error("Erreur lors de la récupération des enseignants :", error);
            }
        };


    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?.id;

        if (!user || user.role !== "enseignant") {
            router.push("/login");
        }

    if (userId) {
        const token = sessionStorage.getItem("token");
        setToken(token);
       apilog.get(`/utilisateur/${userId}`)
        .then(response => {
          setUserInfo(response.data);

            if (response.data?.enseignant?.id_enseignant) {
            fetchProfesseurs();
            }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
        }
        
      }, []);

      const resetModalForm = () => {
        setNewprof({
            id_enseignant: 0,
            nom: "",
            prenom: "",

        });
        setIsEditing(false);
    };
      const handleModalClose = () => {
        setShowModal(false);
        resetModalForm();
    };


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

            {/* add abd edit modal */}
            {showModal && (
                <Modal
                  onCancel={handleModalClose} open={showModal} footer={null}>
                    <h1 className="text-2xl font-semibold">
                        {isEditing ? "Modifier l'information de l'enseignant" : "Ajouter un enseignant"}
                    </h1>

                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Nom de l'enseignant"
                        value={newProf.nom}
                        onChange={(e) => setNewprof({ ...newProf, nom: e.target.value })}
                    />
                    
                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Prénom de l'enseignant"
                        value={newProf.prenom}
                        onChange={(e) => setNewprof({ ...newProf, prenom: e.target.value })}
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={handleModalClose}
                            className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md"
                            onClick={async () => {
                                if (isEditing) {
                                    await update(newProf.id_enseignant, newProf, token!);
                                    fetchProfesseurs();
                                    handleModalClose();
                                } else {
                                    await add(newProf, token!);
                                    fetchProfesseurs();
                                    handleModalClose();
                                }
                            }}
                        >
                            {isEditing ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </Modal>
            )}



            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-2xl font-semibold">Liste des Enseignants</h1>
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
                            onClick={() => {
                                    resetModalForm();
                                    setShowModal(true);
                                }}
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
                        <th className="py-2 px-4">Matiére(s)</th>
                        <th className="py-2 px-4">Actions</th>
                        <th className="py-2 px-4">Voir disponibilité</th>
                    </tr>
                </thead>
                <tbody className="">
                    {proffesseurs.map((prof, index) => (
                        <>
                        <tr key={index} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                    
                            <td className="py-2 px-4">{prof.id_enseignant}</td>
                    
                            <td className="py-2 px-4">{prof.nom}</td>
                    
                            <td className="py-2 px-4">{prof.prenom}</td>
                    
                            <td></td>
                            
                            <td className="py-2 px-4">
                                <div className="flex items-center gap-2">
                                    <button
                                     onClick={() => {
                                        setNewprof(prof);
                                        setIsEditing(true);
                                        setShowModal(true);
                                    }}
                                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                    <Image src="/edit.png" alt="Modifier" width={20} height={20} />
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            if (confirm("Supprimer ce professeur ?")) {
                                                await remove(prof.id_enseignant, token!);
                                                fetchProfesseurs(); 
                                            }
                                        }}
                                    className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                    <Image src="/delete.png" alt="Supprimer" width={20} height={20} />
                                    </button>
                                </div>
                            </td>
                    
                            <td className="py-2 px-4">
                                <button 
                                onClick={() => {
                                    setExpandedProfId(expandedProfId === prof.id_enseignant ? null : prof.id_enseignant);
                                }}
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100">
                                    <Image src="/eye.png" alt="Voir disponibilité" width={20} height={20} />
                                </button>
                            </td>
                        </tr>
                        {expandedProfId === prof.id_enseignant && (
                            <tr className="bg-gray-50 transition duration-200">
                            <td colSpan={7} className="py-4 px-4 border-b border-gray-200">
                                <DisponibiliteProfesseur />
                            </td>
                            </tr>
                        )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProffesseursPage