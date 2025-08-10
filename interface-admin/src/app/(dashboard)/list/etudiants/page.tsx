"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { use, useEffect, useState } from "react";
import {add, update, remove, Etudiant,EtudiantDto, Classes, getClass, getEtudiant } from "@/function/etudiant";
import { Card, Col, Dropdown, MenuProps, Modal, Row, Select, Space } from "antd";
import { DownOutlined } from '@ant-design/icons';
import api from "@/api/axios";
import { UserInfo } from "@/interface/Type";
import { useSearchParams } from "next/navigation";
import { Edit2, Trash2, Users } from "lucide-react";
import DeleteConfirmation from "@/Components/DeleteConfirmation";

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
    const[openModal, setOpenModal]=useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [groupByKey, setGroupByKey] = useState<'Classe' | 'Titre' | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
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

        let utilisateursFiltres = etudiants.filter((item) => {
            const user = item.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.prenom.toLowerCase().includes(searchTerm.toLowerCase());
            return user;
    });

    if (filter === '1') {
        utilisateursFiltres = utilisateursFiltres.slice().sort((a, b) => {
            if (a.matricule.toLowerCase() < b.matricule.toLowerCase()) return -1;
            if (a.matricule.toLowerCase() > b.matricule.toLowerCase()) return 1;
            return 0;
        });
    }
        else if (filter === '2') {
        utilisateursFiltres = utilisateursFiltres.slice().sort((a, b) => {
            if (a.nom.toLowerCase() < b.nom.toLowerCase()) return -1;
            if (a.nom.toLowerCase() > b.nom.toLowerCase()) return 1;
            return 0;
        });
    }
        else if (filter === '3') {
        utilisateursFiltres = utilisateursFiltres.slice().sort((a, b) => {
            if (a.prenom.toLowerCase() < b.prenom.toLowerCase()) return -1;
            if (a.prenom.toLowerCase() > b.prenom.toLowerCase()) return 1;
            return 0;
        });
    }

    const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K): Record<K, T[]> => {
        return array.reduce((result, currentItem) => {
            const groupKey = key(currentItem);
            if (!result[groupKey]) {
            result[groupKey] = [];
            }
            result[groupKey].push(currentItem);
            return result;
        }, {} as Record<K, T[]>);
    };

    const groupedUsers = groupByKey ? groupBy(utilisateursFiltres, user => {
        if (groupByKey === 'Classe') {
            // Create a unique string key for the class
            return `${user.classe.id_niveau}-${user.classe.parcours.code_parcours}-gp${user.classe.groupe}`;
        }
        if (groupByKey === 'Titre') return user.titre;
        return '';
        }) : { 'Tous les utilisateurs': utilisateursFiltres };

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'Matricule',
        },{
             key: '2',
            label: 'Nom',
        },{
             key: '3',
            label: 'Prénom',
        },
        {
            type: 'divider',
        },{
            key: '4',
            label: 'Grouper par',
            children : [
                {
                    key: 'Classe',
                    label: 'Classe',
                    onClick: () => setGroupByKey('Classe')

                },{
                    key: 'Titre',
                    label: 'Titre',
                    onClick: () => setGroupByKey('Titre')
                }
            ]
        },{
            type: 'divider',
        },{
            key: '5',
            label: 'Annuler',
            onClick: () => {setGroupByKey(null), utilisateursFiltres = etudiants}
        },
        
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setFilter(e.key);
    };

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

    const handleDeleteModalClose=()=>{
        setOpenModal(false);
    }

    const handleDelete=async(etudiant : any)=> {
        await remove(etudiant.matricule, token!);
        resetModalForm();
        handleDeleteModalClose();
        fetchEtudiants(); 

    }

    const EtudiantCard = ({ etudiant }: { etudiant: Etudiant }) => (
    <div className="bg-white m-1 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between ">
          <div className="flex-1">
            <div className="flex items-center gap-3 ">
              <div className=" bg-black w-12 h-12  rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {etudiant.nom.charAt(0)}{etudiant.prenom.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                   {etudiant.nom} 
                </h3>
                <p className="text-lg font-base text-gray-700"> {etudiant.prenom}</p>
                <p className="text-sm text-gray-500 font-mono">{etudiant.matricule}</p>
                <p className="text-sm text-gray-500 font-mono">{etudiant.classe.id_niveau} {etudiant.classe.parcours.code_parcours} gp {etudiant.classe.groupe}</p>

              </div>
            </div>
            
            {etudiant.titre && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                  <Users size={12} />
                  {etudiant.titre===1 ? "Simple étudiant(e)" : "Delegué"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <div className="flex gap-1 ">
            <button
                onClick={() => {
                    const classe = `${etudiant.classe.id_parcours}-${etudiant.classe.id_niveau}-${etudiant.classe.groupe}`
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
              className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit2 size={16} />
            </button>
            
            <button
                onClick={async () => {
                    const classe = `${etudiant.classe.id_parcours}-${etudiant.classe.id_niveau}-${etudiant.classe.groupe}`
                    setNewEtudiant({
                        matricule: etudiant.matricule,
                        nom: etudiant.nom,
                        prenom: etudiant.prenom,
                        titre: etudiant.titre,
                        classeKey: classe
                    });
                    setOpenModal(true);

                }}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {showModal && (
                <Modal onCancel={handleModalClose} open={showModal} footer={null}>
                    <h1 className="text-2xl font-semibold py-4 border-b border-gray-500">
                        {isEditing ? "Modifier l'information de l'étudiant(e)" : "Ajouter un(e) étudiant(e)"}
                    </h1><br />
                    <div className="p-6 space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matricule
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                                type="text"
                                placeholder="2928"
                                value={newEtudiant.matricule}
                                disabled={isEditing}
                                onChange={(e) => setNewEtudiant({ ...newEtudiant, matricule: e.target.value })}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                                type="text"
                                placeholder="Ranjamino"
                                value={newEtudiant.nom}
                                onChange={(e) => setNewEtudiant({ ...newEtudiant, nom: e.target.value })}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                                type="text"
                                placeholder="Diamondra"
                                value={newEtudiant.prenom}
                                onChange={(e) => setNewEtudiant({ ...newEtudiant, prenom: e.target.value })}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe
                            </label>
                            <Select
                                    placeholder="Niveau"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
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
                        </div>
                        <div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                Titre
                                </label>
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
                                <label className="ms-2 text-sm  text-gray-900 dark:text-gray-300">Simple</label>
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
                                <label className="ms-2 text-sm  text-gray-900 dark:text-gray-300">Délegué</label>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
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
                        <button
                            onClick={handleModalClose}
                            className="border border-gray-200 text-gray-700 py-2 px-4  rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Annuler
                        </button>
                        
                    </div>
                </Modal>
            )}

            <DeleteConfirmation showModal={openModal} handleModalClose={handleDeleteModalClose} handleDelete={async()=>{handleDelete(newEtudiant)}}/>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestion des Etudiants</h1>
                    <p className="text-gray-600">Gérez les informations de vos étudiants</p>  
                </div> 
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch placeholder="Recherche..." value={searchTerm} onChange={setSearchTerm} />
                    <div className="flex items-center gap-4 self-end">
                        <Dropdown menu={{items, onClick: handleMenuClick}}>
                            <button className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                <Space>
                                <Image src="/filter.png" alt="" width={14} height={14} /> 
                                </Space>
                            </button>
                            
                        </Dropdown>
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

            <div className="w-full mt-4">
                    {/* {groupByKey ? (
                        Object.entries(groupedUsers).map(([group, users]) => (
                                <>
                                <p  className="font-semibold text-md bg-gray-100 py-2 px-4">{group? group.toUpperCase() : " Aucun"}</p>
                                <Row gutter={16} key={group} >
                                    {users.map((user, index) => (                             
                                        <Col span={8} className="py-2"  key={user.matricule} 
                                        xs={24}
                                        sm={+12}
                                        md={ 8}  
                                        >
                                        <Card hoverable>
                                            <div className="flex items-center justify-between gap-2 w-full">
                                                <div>
                                                    <p className="text-lg">
                                                        <strong>{user.matricule}</strong>
                                                    </p>
                                                    <p className="text-base">
                                                        {user.nom} {user.prenom}
                                                    </p>
                                                    <p className="text-base">
                                                        {user.classe.id_niveau} {user.classe.parcours.code_parcours} {user.classe.groupe}
                                                    </p>
                                                    <p className="text-base">
                                                        {user.titre === 1 ? "Simple" : "Délegué"}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const classe = `${user.classe.id_parcours}-${user.classe.id_niveau}-${user.classe.groupe}`;                                                           setNewEtudiant({
                                                               matricule: user.matricule,
                                                               nom: user.nom,
                                                               prenom: user.prenom,
                                                               titre: user.titre,
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
                                                                    await remove(user.matricule, token!);
                                                                    fetchEtudiants(); 
                                                                }
                                                            }}
                                                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                                        <Image src="/delete.png" alt="Supprimer" width={20} height={20} />
                                                     </button>                       
                                                </div>
                                            </div>

                                            </Card>
                                        </Col>                      
                                    ))}   
                                </Row>
                                </>
                        ))
                    ):(
                        <Row gutter={16}>
                            {utilisateursFiltres.map((user, index) => (                             
                                <Col span={8} className="py-1"  key={user.matricule} 
                                    xs={24}
                                    sm={12}
                                    md={6}  
                                >
                                    <Card hoverable>
                                        <div className="flex items-center justify-between  gap-2 w-full">
                                            <div>
                                                <p className="text-lg">
                                                    <strong>{user.matricule}</strong>
                                                </p>
                                                <p className="text-base">
                                                    {user.nom} {user.prenom}
                                                </p>
                                                <p className="text-base">
                                                    {user.classe.id_niveau} {user.classe.parcours.code_parcours} {user.classe.groupe}
                                                </p>
                                                <p className="text-base">
                                                    {user.titre === 1 ? "Simple" : "Délegué"}
                                                </p>
                                            </div>
                                            <div className="flex gap-2" >
                                                    <button
                                                        onClick={() => {
                                                            const classe = `${user.classe.id_parcours}-${user.classe.id_niveau}-${user.classe.groupe}`
                                                           setNewEtudiant({
                                                               matricule: user.matricule,
                                                               nom: user.nom,
                                                               prenom: user.prenom,
                                                               titre: user.titre,
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
                                                                        await remove(user.matricule, token!);
                                                                        fetchEtudiants(); 
                                                                    }
                                                                }}
                                                            className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200">
                                                            <Image src="/delete.png" alt="Supprimer" width={20} height={20} />
                                                    </button> 
                                            </div>
                                        </div>

                                        </Card>
                                    </Col>                      
                                ))}   
                            </Row>
                    )
                    } */}
                {groupByKey ? (
                    Object.entries(groupedUsers).map(([group, users]) => (
                        <>
                            <p  className="font-semibold text-md bg-gray-100 py-2 px-4">{group? group.toUpperCase() : " Aucun"}</p>
                            <Row gutter={16} key={group} >
                                {users.map((e) => (
                                    <Col span={8} className="py-1"  key={e.matricule} 
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={6}  
                            >
                                        <EtudiantCard key={e.matricule } etudiant={e} />
                                    </Col>
                                ))}
                                </Row>
                                </>
                        ))
                    ):(
                        <Row gutter={16}>
                            {utilisateursFiltres.map((e) => (
                                <Col span={8} className="py-1"  key={e.matricule} 
                                            xs={24}
                                            sm={12}
                                            md={8}
                                            lg={6}   
                                >
                                    <EtudiantCard key={e.matricule } etudiant={e} />
                                </Col>
                        ))}
                        </Row>
                    )
                    }
            </div>

        </div>
    )
}

export default EtudiantsPage;