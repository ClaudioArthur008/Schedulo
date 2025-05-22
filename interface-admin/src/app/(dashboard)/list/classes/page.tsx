"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import { Select } from 'antd';
import {  getClass } from "@/function/etudiant";
import { addClasse, getNiveau, getParcours, removeClasse, updateClasse } from "@/function/classe";
import api from "@/api/axios";
import { UserInfo } from "@/interface/Type";

const { Option } = Select;

const ClassesPage = () => {
    interface Parcours {
        id_parcours: number;
        code_parcours: string;
    }

    interface Niveau {
        id_niveau: string;
    }

    interface Classes {
        id_parcours: number;
        id_niveau: string;
        groupe: string;
        niveau: Niveau;
        parcours: Parcours;
    }
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [classes, setClasses] = useState<Classes[]>([]);
    const [parcours, setParcours] = useState<Parcours[]>([]);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [newClasse, setNewClasse] = useState({
        id_parcours: 0,
        id_niveau: "",
        groupe: "",
        niveauIdNiveau: "",
        parcoursIdParcours: 0,
    });
    const [oldClasse, setOldClasse] = useState({
        id_parcours: 0,
        id_niveau: "",
        groupe: "" ,
    });


    const fetchClasses = async () => {
    getClass(setClasses, token!);
  };
    const fetchParcours = async () => {
        getParcours(setParcours, token!);
    }
    const fetchNiveaux = async () => {
       const niveaux = await getNiveau(token!);
        setNiveaux(niveaux);
    }
    const handleAddClasse = async () => {
        await addClasse(newClasse, token!);
        
    };
    const handleEditClasse = (classe: Classes) => {
        setNewClasse({
            id_parcours: classe.id_parcours,
            id_niveau: classe.id_niveau,
            groupe: classe.groupe,
            niveauIdNiveau: classe.niveau.id_niveau,
            parcoursIdParcours: classe.parcours.id_parcours,
        });
        setIsEditing(true);
        setShowModal(true);

        setOldClasse({
            id_parcours: classe.id_parcours,
            id_niveau: classe.id_niveau,
            groupe: classe.groupe,
        })
    };
    const handleUpdateClasse = () => {  
        console.log("is ed :",isEditing);
        updateClasse(oldClasse.id_parcours, oldClasse.id_niveau, oldClasse.groupe, newClasse, token!);
    }
    
    const handleDeleteClasse = (classe: Classes) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")){
            removeClasse(classe.id_parcours, classe.id_niveau, classe.groupe, token!);
        }
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
            fetchClasses();
            fetchParcours();
            fetchNiveaux();
        }
    }, [userInfo]);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const resetModalForm = () => {
        setNewClasse({
            id_parcours: 0,
            id_niveau: "",
            groupe: "",
            niveauIdNiveau: "",
            parcoursIdParcours: 1,
        });
        setIsEditing(false);
    };



    const handleModalClose = () => {
    setShowModal(false);
    resetModalForm();
  }; 

    return (

        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {showModal && (
                <Modal setShowModal={handleModalClose}>
                    <h1 className="text-2xl font-semibold mb-4">
                        {isEditing ? "Modifier la classe" : "Ajouter une classe"}
                    </h1>

                    <div className="flex flex-col gap-4">
                        <Select
                            placeholder="Parcours"
                            value={newClasse.parcoursIdParcours}
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                            onChange={(e) => setNewClasse({ ...newClasse, parcoursIdParcours: e })}
                        >
                            {parcours.map((parcours) => (
                                <Option key={parcours.id_parcours} value={parcours.id_parcours}>
                                    {parcours.code_parcours}
                                </Option>
                            ))}
                        </Select>
                        <Select
                            placeholder="Niveau"
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                            value={newClasse.niveauIdNiveau}
                            onChange={(e) => setNewClasse({ ...newClasse, niveauIdNiveau: e })}
                        >
                            {niveaux.map((niveau) => (
                                <Option key={niveau.id_niveau} value={niveau.id_niveau}>
                                    {niveau.id_niveau}
                                </Option>
                            ))}
                        </Select>
                        <input 
                        type="text"
                        placeholder="Groupe"
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        value={newClasse.groupe}
                        onChange={(e) => setNewClasse({ ...newClasse, groupe: e.target.value })}
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={handleModalClose}
                                className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={ isEditing ? handleUpdateClasse : handleAddClasse}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                                >
                                {isEditing ? "Enregistrer" : "Ajouter"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-2xl font-semibold">Liste des Clases</h1>
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
                                    setShowModal(true);
                                    resetModalForm();
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
                                <th className="py-2 px-4">Parcours</th>
                                <th className="py-2 px-4">Niveau</th>
                                <th className="py-2 px-4">Groupe</th>
                                <th className="py-2 px-4">Action</th>
                            </tr>
                    </thead>
                    <tbody>
                        {classes.map((classe) => (
                            <tr key={classe.id_parcours +classe.id_niveau+ classe.groupe } className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                                <td className="py-2 px-4">{classe.parcours.code_parcours}</td>
                                <td className="py-2 px-4">{classe.id_niveau}</td>
                                <td className="py-2 px-4">{classe.groupe}</td>
                                <td className="py-2 px-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={()=> handleEditClasse(classe)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                            <Image src="/edit.png" alt="Modifier" width={20} height={20}  />
                                        </button>
                                        <button onClick={()=>handleDeleteClasse(classe)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                            <Image src="/delete.png" alt="Supprimer" width={20} height={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>


    )
}

export default ClassesPage;