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
    const [filter, setFilter] = useState<string | null>(null);
    const [groupByKey, setGroupByKey] = useState<'Classe' | 'Titre' | null>(null);
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
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
                    <TableSearch placeholder="Recherche..."/>
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

            {/* <table className="w-full mt-4">
                <thead>
                    <tr className="text-left text-gray-500 text-sm">
                        <th className="py-2 px-4">Matricule </th>
                        <th className="py-2 px-4">Nom</th>
                        <th className="py-2 px-4">Prénom</th>
                        <th className="py-2 px-4">
                                Titre
                        </th>
                        <th className="py-2 px-4">
                            Classes
                        </th>
                        <th className="py-2 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="">
                    {utilisateursFiltres.map((etudiant, index) => (
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
            </table> */}
                <div className="w-full mt-4">
                    {groupByKey ? (
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
                    }
            </div>

        </div>
    )
}

export default EtudiantsPage;