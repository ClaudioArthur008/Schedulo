"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { useEffect, useState } from "react";
import {add, update, remove, Etudiant,EtudiantDto, Classes, getClass, getEtudiant } from "@/function/etudiant";
import { Modal, Select } from "antd";
import api from "@/api/axios";
import { UserInfo } from "@/interface/Type";
const EtudiantsPage = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [newEtudiant, setNewEtudiant] = useState<EtudiantDto>({
        matricule: "",
        nom: "",
        prenom: "",
        titre: 0,
        classeKey: ""
    });
    const [classeItem, setClasseItem]= useState<Classes[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fetchEtudiants = () => {
        getEtudiant(setEtudiants,token!);
        }

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
        fetchEtudiants();
        getClass(setClasseItem,token!);
    }
      }, [userInfo]);

    const resetModalForm = () => {
        setNewEtudiant({
        matricule: "",
        nom: "",
        prenom: "",
        titre: 0,
        classeKey: ""
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
                <Modal onCancel={handleModalClose} open={showModal} footer={null}>
                    <h1 className="text-2xl font-semibold">
                        {isEditing ? "Modifier l'information de l'enseignant" : "Ajouter un enseignant"}
                    </h1><br />

                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Matricule de l'étudiant"
                        value={newEtudiant.matricule}
                        onChange={(e) => setNewEtudiant({ ...newEtudiant, matricule: e.target.value })}
                    />

                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Nom de l'étudiant"
                        value={newEtudiant.nom}
                        onChange={(e) => setNewEtudiant({ ...newEtudiant, nom: e.target.value })}
                    />
                    
                    <input
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        type="text"
                        placeholder="Prénom de l'étudiant"
                        value={newEtudiant.prenom}
                        onChange={(e) => setNewEtudiant({ ...newEtudiant, prenom: e.target.value })}
                    />

                    <Select
                            placeholder="Niveau"
                            className="w-full mb-4 p-2 border border-gray-300 rounded"
                            value={newEtudiant.classeKey}
                            onChange={(e)=>setNewEtudiant({...newEtudiant, classeKey : e })}
                           
                        >
                            {classeItem.map((classe) => (
                                <Select.Option
                                    key={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
                                    value={`${classe.id_parcours}-${classe.id_niveau}-${classe.groupe}`}
                                    >
                                    {`${classe.id_niveau} ${classe.parcours.code_parcours} gp${classe.groupe}`}
                                    </Select.Option>
                            ))}
                    </Select>

                    <div className="flex items-center mb-4">
                        <input 
                            type="radio"
                            id="Simple"
                            name="titre"
                            value="1"
                            checked={newEtudiant.titre === 1}
                            onChange={() => setNewEtudiant({ ...newEtudiant, titre: 1 })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Simple</label>
                    </div>
                    <div className="flex items-center mb-4">
                        <input 
                            type="radio"
                            id="css"
                            name="titre"
                            value="2"
                            checked={newEtudiant.titre === 2}
                            onChange={() => setNewEtudiant({ ...newEtudiant, titre: 2 })}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Délegué</label>
                    </div>


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
                                    await update( newEtudiant, token!);
                                    fetchEtudiants();
                                    handleModalClose();
                                } else {
                                    await add(newEtudiant,token!);
                                    fetchEtudiants();
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
                <h1 className="hidden md:block text-2xl font-semibold">Liste des Etudiants</h1>
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
                        <th className="py-2 px-4">Matricule </th>
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prénom</th>
                        <th className="py-2 px-4">Titre</th>
                        <th className="py-2 px-4">Classe</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                    {etudiants.map((etudiant, index) => (
                                            <tr key={index} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                    
                                                <td className="py-2 px-4">{etudiant.matricule}</td>
                    
                                                <td className="py-2 px-4">{etudiant.nom}</td>
                    
                                                <td className="py-2 px-4">{etudiant.prenom}</td>
                    
                                                <td className="py-2 px-4">
                                                    {etudiant.titre === 1 ? "Simple" : "Délegué"}
                                                </td>
                    
                                                <td>{etudiant.classe.id_niveau} {etudiant.classe.parcours.code_parcours}  gp{etudiant.classe.groupe}</td>
                                              
                                                
                                                <td className="py-2 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                        onClick={() => {
                                                            const classe = `${etudiant.classe.id_niveau} ${etudiant.classe.parcours.code_parcours} ${etudiant.classe.groupe}`
                                                           setNewEtudiant({
                                                               matricule: etudiant.matricule,
                                                               nom: etudiant.nom,
                                                               prenom: etudiant.prenom,
                                                               titre: etudiant.titre,
                                                               classeKey: classe
                                                           });
                                                            setIsEditing(true);
                                                            setShowModal(true);
                                                        }}
                                                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                                        <Image src="/edit.png" alt="Modifier" width={20} height={20} />
                                                        </button>
                                                        <button 
                                                            onClick={async () => {
                                                                if (confirm("Supprimer ce professeur ?")) {
                                                                    await remove(etudiant.matricule, token!);
                                                                    fetchEtudiants(); 
                                                                }
                                                            }}
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

export default EtudiantsPage;