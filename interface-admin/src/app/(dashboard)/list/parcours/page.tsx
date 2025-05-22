"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";

import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";

import { Select } from 'antd';
import { get } from "http";
import { addParcours, getMention, getParcours, removeParcours, updateParcours } from "@/function/classe";
import { UserInfo } from "@/interface/Type";
import api from "@/api/axios";


const { Option } = Select;

const ParcoursPage = () => {

const [showModal, setShowModal] = useState(false);
const [isEditing, setIsEditing] = useState(false);

    interface Mention {
        id_mention: number
        nom_mention: string;

      }
      
      interface Parcours {
        id_parcours: number;
        nom_parcours: string;
        code_parcours: string;
        mention: Mention;
      }
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [parcours, setParcours] = useState<Parcours[]>([]);
    const [mentions, setMentions] = useState<Mention[]>([]);
    const [newParcours, setNewParcours] = useState({
      id_parcours: 0,
      nom_parcours: "",
      code_parcours: "",
      mentionIdMention: 0
    });

  const fetchParcours = async () => {
    getParcours(setParcours, token!);
  };

  const fetchMentions = async () => {
    getMention(setMentions, token!);
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
    fetchParcours();
    fetchMentions();
  }, [userInfo]);


    const resetModalForm = () => {
    setNewParcours({
      id_parcours: 0,
      nom_parcours: "",
      code_parcours: "",
      mentionIdMention: 0
    });
    setIsEditing(false);
  };

const handleAddParcours = async () => {
    if (newParcours.mentionIdMention === 0) {
        alert('Veuillez sélectionner une mention');
        return;
    }

    await addParcours(newParcours, token!)
  };

const handleDeleteParcours = async (id_parcours: number) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")) {
    await removeParcours(id_parcours, token!);
  }
};


    const handleEditParcours =  (parcours: Parcours) => {
    setIsEditing(true);
    setNewParcours({
      id_parcours: parcours.id_parcours,
      nom_parcours: parcours.nom_parcours,
      code_parcours: parcours.code_parcours,
      mentionIdMention: parcours.mention.id_mention
    });
    setShowModal(true);
  };

    const handleUpdateParcours = async () => {
    if (newParcours.mentionIdMention === 0) {
      alert('Veuillez sélectionner une mention');
      return;
    }

    await updateParcours(newParcours, token!);
  };

    const handleModalClose = () => {
    setShowModal(false);
    resetModalForm();
  }; 

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

            {
                showModal && (
                    <Modal setShowModal={handleModalClose}>
                        <h1 className="text-xl font-semibold mb-4">
                            {isEditing ? "Modifier le parcours" : "Ajouter un parcours"}
                        </h1>

                        <input
                        type="text"
                        placeholder="Nom du parcours"
                        value={newParcours.nom_parcours}
                        onChange={(e) => setNewParcours({ ...newParcours, nom_parcours: e.target.value })}
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        />

                        <input
                        type="text"
                        placeholder="Code du parcours"
                        value={newParcours.code_parcours}
                        onChange={(e) => setNewParcours({ ...newParcours, code_parcours: e.target.value })}
                        className="w-full mb-2 p-2 border border-gray-300 rounded"
                        />

                        <Select
                        placeholder="Mention"
                        value={newParcours.mentionIdMention || undefined}
                        onChange={(value) => setNewParcours({ ...newParcours, mentionIdMention: Number(value) })}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        >
                        {mentions.map((m) => (
                            <Option key={m.id_mention} value={m.id_mention}>
                            {m.nom_mention}
                            </Option>
                        ))}
                        </Select>

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={handleModalClose}
                                className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={isEditing ? handleUpdateParcours : handleAddParcours}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                                >
                                {isEditing ? "Enregistrer" : "Ajouter"}
                            </button>
                        </div>
                    </Modal>
                )
            }

          <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-2xl font-semibold">Liste des Parcours</h1>
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
                        <th className="py-2 px-4">Parcours</th>
                        <th className="py-2 px-4">Code</th>
                        <th className="py-2 px-4">Mention</th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                {parcours.map((p, index) => (
                    <tr key={index} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                    <td className="py-2 px-4">{p.nom_parcours}</td>
                    <td className="py-2 px-4">{p.code_parcours}</td>
                    <td className="py-2 px-4">{p.mention.nom_mention}</td>
                    <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                        <button onClick={() => handleEditParcours(p)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                            <Image src="/edit.png" alt="Modifier" width={20} height={20} />
                        </button>
                        <button onClick={()=>handleDeleteParcours(p.id_parcours)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
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
        
    );
}

export default ParcoursPage;