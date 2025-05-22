"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import { Select } from 'antd';
import { addMatiere, getMatiere, removeMatiere, updateMatiere } from "@/function/matiere";
import api from "@/api/axios";
import { UserInfo } from "@/interface/Type";
 

const MatierePage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
        const [token, setToken] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    interface Matiere {
        id_matiere: number;
        nom_matiere: string;
    }
    const [matieres, setMatieres] = useState<Matiere[]>([]);
    const [newMatiere, setNewMatiere] = useState<Matiere>({
        id_matiere: 0,
        nom_matiere: "",
    });

    const fetchMatieres = async () => {
        const response = await getMatiere(token!);
        setMatieres(response);
    };

      useEffect(() => {
    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.id;

    if (userId) {
      const token = sessionStorage.getItem("token");
      setToken(token);
      api(token!).get(`/utilisateur/${userId}`)
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
    }
  }, []);

    useEffect(() => {
    if (userInfo?.enseignant?.id_enseignant) {
        fetchMatieres();
    }
    }, [userInfo]);

    const resetModalForm = () => {
        setNewMatiere({
            id_matiere: 0,
            nom_matiere: "",
        });
        setIsEditing(false);
    };

  const handleAddMatiere = async () => {
    await addMatiere(newMatiere, token!)
  };

    const handleDeleteMatiere = async (id_matiere: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
            await removeMatiere(id_matiere, token!);
            fetchMatieres();
        }
    };
    
    const handleEditMatiere = (matiere: Matiere) => {
        setNewMatiere(matiere);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleUpdateMatiere = async  () => {
        await updateMatiere(newMatiere, token!);
    };

    const handleModalClose = () => {
        setShowModal(false);
        resetModalForm();
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {showModal && (
                <Modal setShowModal={handleModalClose}>
                    <h1 className="text-2xl font-semibold">
                        {isEditing ? "Modifier la matière" : "Ajouter une matière"}
                    </h1>
                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Nom de la matière"
                        value={newMatiere.nom_matiere}
                        onChange={(e) => setNewMatiere({ ...newMatiere, nom_matiere: e.target.value })}
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
                            onClick={isEditing ? handleUpdateMatiere : handleAddMatiere}
                        >
                            {isEditing ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </Modal>
            )}

            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-2xl font-semibold">
                        Liste des matières
                    </h1>
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
                                className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100"
                            >
                                <Image src="/create.png" alt="" width={14} height={14} />
                            </button>
                        </div>
                    </div>
                </div>
                <table className="w-full mt-4">
                    <thead>
                        <tr className="text-left text-gray-500 text-sm">
                            <th className="py-2 px-4">Matières</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matieres.map((matiere) => (
                            <tr key={matiere.id_matiere} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                                <td className="py-2 px-4">{matiere.nom_matiere}</td>
                                <td className="p-2 flex gap-2">
                                    <button onClick={()=> handleEditMatiere(matiere)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                        <Image src="/edit.png" alt="" width={20} height={20} />
                                    </button>
                                    <button onClick={()=>handleDeleteMatiere(matiere.id_matiere)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                        <Image src="/delete.png" alt="" width={20} height={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    )
}

export default MatierePage;