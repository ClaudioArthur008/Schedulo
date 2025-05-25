'use client';
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { approuveUser, deleteUser, getUser, User } from "@/function/user";
import type { MenuProps } from 'antd';
import { Card, Col, Dropdown, Modal, Row, Space, Switch } from 'antd';
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';


const UtilisateurPage = () => {
    const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
    const[showModal, setShowModal]=useState<boolean>(false);
    const [approuve, setApprouve] = useState<boolean>(false);
    const [isDeleting, setisDeleting] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filtreActuel, setFiltreActuel] = useState<string | null>(null);
    const [groupByKey, setGroupByKey] = useState<'role' | 'statut' | null>(null);
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || '';

    useEffect( () => {
         getUser(setUtilisateurs);
    }
    , []);

        const utilisateursFiltres = utilisateurs.filter((item) => {
        const user =item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.enseignant?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.etudiant?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.etudiant?.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.enseignant?.id_enseignant.toLowerCase().includes(searchTerm.toLowerCase());

        if(user)
        {          
            if (filtreActuel === '4')
            {
                return true;
            }  
            if (filtreActuel === '2') 
            {
                return item.role;
            } 
            if (filtreActuel === '3')
            {
                return item.approuve; 
            }
        }
        return user;
    });

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
    if (groupByKey === 'role') return user.role;
    if (groupByKey === 'statut') return user.approuve ? 'Approuvé' : 'En attente';
    return '';
    }) : { 'Tous les utilisateurs': utilisateurs };

    const items: MenuProps['items'] = [
    {
        key: '1',
        label: 'Grouper par',
        disabled : true
    },
    {
        type: 'divider',
    },
    {
            key: '2',
            label: 'Rôle',
            onClick: () => setGroupByKey('role')
        },
        {
            key: '3',
            label: 'Statut',
            onClick: () => setGroupByKey('statut')
    },
    {
        type: 'divider',
    },
     {
        key: '4',
        label: 'Annuler',
        onClick : ()=>setGroupByKey(null)
    },
    ];

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setFiltreActuel(e.key);
    };
    const handleModalClose=async()=>{
        setSelectedUser(null);
        setShowModal(false)
        setApprouve(false);
        setisDeleting(false);
    }


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {showModal&&(
                <Modal open={showModal} onCancel={handleModalClose} footer={null}>
                    <br />
                    {isDeleting || approuve 
                        ?(
                            <div>
                                <p className=" font-semibold mb-4">Vous voulez vraiment {selectedUser?.approuve? "desapprouver" : "approuver"} le compte de cet utilisateur</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleModalClose}
                                            className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={async()=>{
                                                if(selectedUser && selectedUser.id_utilisateur!=null)
                                                    await approuveUser(selectedUser?.id_utilisateur, setUtilisateurs)
                                                    await handleModalClose();
                                            }}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                                        > 
                                            {selectedUser?.approuve? "Désapprouver" : "Approuver"}
                                        </button>
                                    </div>
                            </div>
                            ):(
                                <>
                                    <p className=" font-semibold mb-4">Vous voulez vraiment supprimer le compte de cet utilisateur</p>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={handleModalClose}
                                                className="text-red-500 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={async()=>{
                                                    if(selectedUser && selectedUser.id_utilisateur!=null)
                                                        await deleteUser(selectedUser?.id_utilisateur, setUtilisateurs)
                                                        await handleModalClose();
                                                    }}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                                            > 
                                                Supprimer
                                            </button>
                                        </div>
                                    </>
                                        
                                )
                            }

                    
                </Modal>
            )}
           <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-2xl font-semibold">Liste des utilisateurs</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch placeholder= "Recherche..." />
                    <div className="flex items-center gap-4 self-end">
                        <Dropdown menu={{items, onClick: handleMenuClick}}>
                            <button className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                                <Space>
                                <Image src="/filter.png" alt="" width={14} height={14} /> 
                                </Space>
                            </button>
                            
                        </Dropdown>
                    </div>
                </div>
            </div>
                <div className="w-full mt-4">
                    {groupByKey ? (
                        Object.entries(groupedUsers).map(([group, users]) => (
                                <>
                                <p  className="font-semibold text-md bg-gray-100 py-2 px-4">{group? group.toUpperCase() : " Aucun"}</p>
                                <Row gutter={16} key={group} >
                                    {users.map((user, index) => (                             
                                        <Col span={8} className="py-4"  key={user.id_utilisateur} 
                                        xs={24}
                                        sm={+12}
                                        md={ 8}  
                                        >
                                        <Card hoverable>
                                            <div className="flex items-center py-5 justify-between gap-2 w-full">
                                                <div>
                                                    <p className="text-lg">
                                                        <strong> Utilisateur n° : {user.id_utilisateur}</strong>
                                                    </p>
                                                    <p className="text-base">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-base">
                                                        {user.role}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        title="Supprimer"
                                                        className="py-2 px-4 cursor-pointer"
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setApprouve(true);
                                                            setSelectedUser(user);
                                                        }}
                                                    >
                                                        <Switch checked={user.approuve} disabled />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setisDeleting(true);
                                                            setSelectedUser(user);
                                                        }}
                                                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200"
                                                    >
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
                    <Row gutter={16}  >
                                    {utilisateursFiltres.map((user, index) => (                             
                                        <Col span={8} className="py-4"  key={user.id_utilisateur} 
                                        xs={24}
                                        sm={+12}
                                        md={ 8}  
                                        >
                                        <Card hoverable>
                                            <div className="flex items-center py-5 justify-between gap-2 w-full">
                                                <div>
                                                    <p className="text-lg">
                                                        <strong> Utilisateur n° : {user.id_utilisateur}</strong>
                                                    </p>
                                                    <p className="text-base">
                                                        {user.email}
                                                    </p>
                                                    <p className="text-base">
                                                        {user.role}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        title="Supprimer"
                                                        className="py-2 px-4 cursor-pointer"
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setApprouve(true);
                                                            setSelectedUser(user);
                                                        }}
                                                    >
                                                        <Switch checked={user.approuve} disabled />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setisDeleting(true);
                                                            setSelectedUser(user);
                                                        }}
                                                        className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-200"
                                                    >
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
export default UtilisateurPage;