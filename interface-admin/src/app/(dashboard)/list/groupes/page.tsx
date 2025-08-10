'use client';
import React, { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Users, Award, Search, Filter, Plus, Trash2, Edit2 } from 'lucide-react';
import { UserInfo } from '@/interface/Type';
import { addClasse, addMention, addParcours, getMention, getNiveau, getParcours, removeClasse, removeMention, removeParcours, updateClasse, updateMention, updateParcours } from '@/function/classe';
import api from '@/api/axios';
import Image from 'next/image';
import Modal from '@/Components/Modal';
import { Select } from 'antd';
import { getClass } from '@/function/etudiant';
import { addMatiere, getMatiere, removeMatiere, updateMatiere, updateMatiereClasse } from '@/function/matiere';
import { useSearchParams } from 'next/navigation';
import TableSearch from '@/Components/TableSearch';
interface Mentions {
        id_mention: number;
        nom_mention: string;
}
interface Parcours {
  id_parcours: number;
  nom_parcours: string;
  code_parcours: string;
  mention: Mentions;
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

interface Matiere {
  id_matiere: number;
  nom_matiere: string;
}

const { Option } = Select;
const groupePage = () => {
  const [activeTab, setActiveTab] = useState('mentions');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [mentions, setMentions] = useState<Mentions[]>([]);
  const [newMention, setNewMention] = useState<Mentions>({
        id_mention: 0,
        nom_mention: "",
  });
  const [parcours, setParcours] = useState<Parcours[]>([]);
  const [newParcours, setNewParcours] = useState({
    id_parcours: 0,
    nom_parcours: "",
    code_parcours: "",
    mention:{id_mention:0}
  });
  const [classes, setClasses] = useState<Classes[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [newClasse, setNewClasse] = useState({
        id_parcours: 0,
        id_niveau: "",
        groupe: "",
        niveau: {id_niveau: ""},
        parcours:{id_parcours:0},
  });

  const [oldClasse, setOldClasse] = useState({
        id_parcours: 0,
        id_niveau: "",
        groupe: "" ,
  });

  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [newMatiere, setNewMatiere] = useState<Matiere>({
      id_matiere: 0,
      nom_matiere: "",
  });

  const fetchMentions = () => {
    getMention(setMentions, token!);
  };
  const fetchParcours = async () => {
    getParcours(setParcours, token!);
  };

  const fetchClasses = async () => {
    getClass(setClasses, token!);
  };

  const fetchNiveaux = async () => {
    const niveaux = await getNiveau(token!);
    setNiveaux(niveaux);
  }

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
      setToken(token)
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
        fetchMentions();
        fetchParcours();
        fetchClasses();
        fetchNiveaux();
        fetchMatieres();
    }
  }, [userInfo]);
  const resetModalForm = () => {
      setNewMention({
          id_mention: 0,
          nom_mention: "",
      });
      setNewParcours({
        id_parcours: 0,
        nom_parcours: "",
        code_parcours: "",
        mention: { id_mention: 0 }
      });
      setIsEditing(false);
    };
  
    const handleAddMention = async () => {
     await addMention(newMention,token!);
      resetModalForm();
      setShowModal(false);
      fetchMentions();
    };
    const handleAddParcours = async () => {
      if (newParcours.mention.id_mention === 0) {
          alert('Veuillez sélectionner une mention');
          return;
      }
      await addParcours(newParcours, token!)
    };

    const handleAddClasse = async () => {
      await addClasse(newClasse, token!);      
    };

    const handleAddMatiere = async () => {
      await addMatiere(newMatiere, token!)
    };

    const handleDeleteMention = (id_mention: number) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette mention ?")) {
        removeMention(id_mention,token!);
        fetchMentions();
      }
    };

    const handleDeleteParcours = async (id_parcours: number) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")) {
        await removeParcours (id_parcours, token!);
        fetchParcours();
      }
    };

    const handleDeleteClasse = (classe: Classes) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce parcours ?")){
          removeClasse(classe.id_parcours, classe.id_niveau, classe.groupe, token!);
          fetchClasses();
      }
    };

    const handleDeleteMatiere = async (id_matiere: number) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
          await removeMatiere(id_matiere, token!);
          fetchMatieres();
      }
    };

    const handleEditMention = (mention: Mentions) => {
      setNewMention(mention);
      setIsEditing(true);
      setShowModal(true);
    }

  const handleEditParcours =  (parcours: Parcours) => {
    setIsEditing(true);
    setNewParcours({
      id_parcours: parcours.id_parcours,
      nom_parcours: parcours.nom_parcours,
      code_parcours: parcours.code_parcours,
      mention:{id_mention: parcours.mention.id_mention}
    });
    setShowModal(true);
  };

  const handleEditClasse = (classe: Classes) => {
    setNewClasse({
        id_parcours: classe.id_parcours,
        id_niveau: classe.id_niveau,
        groupe: classe.groupe,
        niveau: {id_niveau :classe.niveau.id_niveau},
        parcours:{id_parcours: classe.parcours.id_parcours}
    });
    setIsEditing(true);
    setShowModal(true);

    setOldClasse({
        id_parcours: classe.id_parcours,
        id_niveau: classe.id_niveau,
        groupe: classe.groupe,
    })
  };

  const handleEditMatiere = (matiere: Matiere) => {
    setNewMatiere(matiere);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdateMention = () => {
      if (newMention.id_mention === 0) {
          alert('Veuillez sélectionner une mention');
          return;
      }
      updateMention(newMention, token!);
  }

  const handleUpdateParcours = async () => {
      if (newParcours.mention.id_mention === 0) {
        alert('Veuillez sélectionner une mention');
        return;
      }
    await updateParcours(newParcours, token!);
  };

  const handleUpdateClasse = () => {  
      console.log("is ed :",isEditing);
      updateClasse(oldClasse.id_parcours, oldClasse.id_niveau, oldClasse.groupe, newClasse, token!);
  };

  const handleUpdateMatiere = async  () => {
    await updateMatiere(newMatiere, token!);
  };
  
  const handleModalClose = () => {
      fetchMentions();
      fetchParcours();
      fetchClasses();
      fetchNiveaux();
      fetchMatieres();
      setShowModal(false);
      resetModalForm();
  }; 

  const tabs = [
    { id: 'mentions', label: 'Mentions', icon: Award },
    { id: 'parcours', label: 'Parcours', icon: GraduationCap },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'matieres', label: 'Matières', icon: BookOpen },
  ];

  let mentionFilter= mentions.filter(mention => mention.nom_mention.toLowerCase().includes(searchTerm.toLowerCase()));
  let parcoursFilter =parcours.filter(parcours => 
          parcours.nom_parcours.toLowerCase().includes(searchTerm.toLowerCase())||
          parcours.code_parcours.toLowerCase().includes(searchTerm.toLowerCase())
    );
  let matieresFilter = matieres.filter(matiere => matiere.nom_matiere.toLowerCase().includes(searchTerm.toLowerCase()));

  const renderContent = () => {
    switch (activeTab) {
      case 'mentions':
        return (
          <div >
            <table className="w-full mt-4">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="py-2 px-4">Mention</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
                  <tbody>
                    {mentionFilter.map((mention) => (
                      <tr key={mention.id_mention} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                        <td className="py-2 px-4">{mention.nom_mention}</td>
                        <td className="py-2 px-4 flex items-center gap-2">
                          <button 
                            onClick={()=> handleEditMention(mention)} 
                            title='Modifier'
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={()=>handleDeleteMention(mention.id_mention)} 
                            title='Supprimer'
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        );
      case 'parcours':
        return (
          <div >
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
              {parcoursFilter.map((p, index) => (
                  <tr key={index} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                  <td className="py-2 px-4">{p.nom_parcours}</td>
                  <td className="py-2 px-4">{p.code_parcours}</td>
                  <td className="py-2 px-4">{p.mention.nom_mention}</td>
                  <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditParcours(p)} 
                        title='Modifier'
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={()=>handleDeleteParcours(p.id_parcours)} 
                        title='Supprimer'
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      </div>
                  </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        );

      case 'classes':
        return (
          // <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          //   <div className="overflow-x-auto">
          //     <table className="w-full">
          //       <thead className="bg-gray-50 border-b border-gray-200">
          //         <tr>
          //           <th className="text-left py-4 px-6 font-medium text-gray-900">Classe</th>
          //           <th className="text-left py-4 px-6 font-medium text-gray-900">Parcours</th>
          //           <th className="text-left py-4 px-6 font-medium text-gray-900">Étudiants</th>
          //           <th className="text-left py-4 px-6 font-medium text-gray-900">Salle</th>
          //         </tr>
          //       </thead>
          //       <tbody className="divide-y divide-gray-200">
          //         {data.classes.map((item) => (
          //           <tr key={item.id} className="hover:bg-gray-50 transition-colors">
          //             <td className="py-4 px-6">
          //               <div className="flex items-center">
          //                 <div className="p-2 bg-purple-100 rounded-lg mr-3">
          //                   <Users className="w-4 h-4 text-purple-600" />
          //                 </div>
          //                 <span className="font-medium text-gray-900">{item.nom}</span>
          //               </div>
          //             </td>
          //             <td className="py-4 px-6 text-gray-600">{item.parcours}</td>
          //             <td className="py-4 px-6">
          //               <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
          //                 {item.etudiants}
          //               </span>
          //             </td>
          //             <td className="py-4 px-6 text-gray-600">{item.salle}</td>
          //           </tr>
          //         ))}
          //       </tbody>
          //     </table>
          //   </div>
          //</div>
          <div>
            <table className="w-full mt-4">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="py-2 px-4">Parcours</th>
                  <th className="py-2 px-4">Niveau</th>
                  <th className="py-2 px-4">Groupe</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classe) => (
                  <tr key={`${classe.id_parcours}-${classe.niveau.id_niveau}-${classe.groupe}`} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                    <td className="py-2 px-4">{classe.parcours.nom_parcours}</td>
                    <td className="py-2 px-4">{classe.niveau.id_niveau}</td>
                    <td className="py-2 px-4">{classe.groupe}</td>
                    <td className="py-2 px-4 flex items-center gap-2">
                      <button onClick={() => handleEditClasse(classe)} title='Modifier'
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                      >
                      <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClasse(classe)} 
                        title='Supprimer'
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        );

      case 'matieres':
        return (
          <table className="w-full mt-4">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-2 px-4">Matière</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {matieresFilter.map((matiere) => (
                <tr key={matiere.id_matiere} className="text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-50 transition duration-200">
                  <td className="py-2 px-4">{matiere.nom_matiere}</td>
                  <td className="p-2 flex gap-2">
                    <button 
                        onClick={() => handleEditMatiere(matiere)} 
                        title='Modifier'
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                      >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      title='Supprimer'
                      onClick={() => handleDeleteMatiere(matiere.id_matiere)} 
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const modalContent = () => {
    switch (activeTab) {
      case 'mentions':
        return(
          showModal && (
            <Modal setShowModal={handleModalClose}>
              <h1 className="text-2xl font-semibold">
                {isEditing ? "Modifier la mention" : "Ajouter une mention"}
              </h1>
              <input 
                className="w-full mb-2 p-2 border border-gray-300 rounded"
                type="text" 
                placeholder="Nom de la mention" 
                onChange={(e) => setNewMention({ ...newMention, nom_mention: e.target.value })} 
                value={newMention.nom_mention}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleModalClose}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                  onClick={isEditing ? handleUpdateMention : handleAddMention}
                >
                  {isEditing ? "Modifier" : "Ajouter"}
                </button>
              </div>
           </Modal>
          )
      );
      case 'parcours':
        return(
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
                  value={newParcours.mention.id_mention || undefined}
                  onChange={(value) => setNewParcours({ ...newParcours, mention :{id_mention: Number(value)} })}
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                  >
                  {mentions.map((m) => (
                      <Option key={m.id_mention} value={m.id_mention}>
                        {m.nom_mention}
                      </Option>))}
                </Select>
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleModalClose}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={isEditing ? handleUpdateParcours : handleAddParcours}
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                        >
                        {isEditing ? "Enregistrer" : "Ajouter"}
                    </button>
                </div>
            </Modal>
        )
      );
      case 'classes':
        return(
          showModal && (
            <Modal setShowModal={handleModalClose}>
                <h1 className="text-2xl font-semibold mb-4">
                      {isEditing ? "Modifier la classe" : "Ajouter une classe"}
                </h1>

                <div className="flex flex-col gap-4">
                    <Select
                        placeholder="Parcours"
                        value={newClasse.parcours.id_parcours}
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        onChange={(e) => setNewClasse({ ...newClasse, parcours: {id_parcours:e }, id_parcours:e})}
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
                        value={newClasse.niveau.id_niveau}
                        onChange={(e) => setNewClasse({ ...newClasse, niveau:{id_niveau:e} , id_niveau:e })}
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
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                        >
                            Annuler
                         </button>
                        <button
                            onClick={ isEditing ? handleUpdateClasse : handleAddClasse}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                            >
                            {isEditing ? "Enregistrer" : "Ajouter"}
                        </button>
                    </div>
                </div>
            </Modal>
        )
      );
      case 'matieres':
        return(
          showModal && (
            <Modal setShowModal={handleModalClose}>
                <h1 className="text-2xl font-semibold mb-4">
                    {isEditing ? "Modifier la matière" : "Ajouter une matière"}
                </h1>

                <input
                    type="text"
                    placeholder="Nom de la matière"
                    value={newMatiere.nom_matiere}
                    onChange={(e) => setNewMatiere({ ...newMatiere, nom_matiere: e.target.value })}
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={handleModalClose}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={isEditing ? handleUpdateMatiere : handleAddMatiere}
                        className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                    >
                        {isEditing ? "Enregistrer" : "Ajouter"}
                    </button>
                </div>
            </Modal>
        )
      );
      default:
        return null;
    }
  }



  return (
    <div className="bg-white h-full mx-3 my-1 px-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div>
        {modalContent()};
      </div>
      <div>
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Vue d'ensemble</h1>
            <p className="text-gray-600">Gestion des parcours, classes, matières et mentions</p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch placeholder="Recherche..." value={searchTerm} onChange={setSearchTerm}/>
              <div className="flex items-center gap-4 self-end">
                <button 
                  title='Ajouter'
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-2">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm(""); 
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="animate-in fade-in duration-200">
          {renderContent()}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{mentions.length}</div>
            <div className="text-sm text-gray-600">Mentions</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{parcours.length}</div>
            <div className="text-sm text-gray-600">Parcours</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{classes.length}</div>
            <div className="text-sm text-gray-600">Classes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{matieres.length}</div>
            <div className="text-sm text-gray-600">Matières</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default groupePage;