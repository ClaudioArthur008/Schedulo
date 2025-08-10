'use client';
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { approuveUser, deleteUser, getUser, User } from "@/function/user";
import type { MenuProps } from 'antd';
import { Card, Col, Dropdown, Modal, Row, Space, Switch } from 'antd';
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";


const UtilisateurPage = () => {
    const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
    const[showModal, setShowModal]=useState<boolean>(false);
    const [approuve, setApprouve] = useState<boolean>(false);
    const [isDeleting, setisDeleting] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filtreActuel, setFiltreActuel] = useState<string | null>(null);
    const [groupByKey, setGroupByKey] = useState<'role' | 'statut' | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const ProfessorCard = ({ user }: { user: User }) => (
    <div className="bg-white m-1 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between ">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className=" bg-black w-12 h-10  rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {user.etudiant
                  ? `${user.etudiant?.nom.charAt(0)}${user.etudiant?.prenom.charAt(0)}`
                  : `${user.enseignant?.nom.charAt(0)}${user.enseignant?.prenom.charAt(0)}`
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                {user.etudiant
                  ? `${user.etudiant?.nom}`
                  : `${user.enseignant?.nom}`
                }
                </h3>
                <p className="text-lg font-base text-gray-700"> 
                {user.etudiant
                  ? ` ${user.etudiant?.prenom}`
                  : `${user.enseignant?.prenom}`
                }
                </p>                
                <p className="text-sm text-gray-500 font-mono">{user.role === 'admin' ? "Administrateur" : "Utilisateur"}</p>
                <p className="text-sm text-gray-500 font-mono">{user.email}</p>  
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-1">
          <div className="flex gap-1 ">
            <div className="p-2">
                <Switch checked={user.approuve}  title="Approuver" 
                style={{backgroundColor: user.approuve ? '#BEFF61' : '#EDF2E6'}}
                onClick={() => {
                        setShowModal(true);
                        setApprouve(true);
                        setSelectedUser(user);
                    }}
                />
            </div>
              
            <button
              onClick={async()=>{
                setShowModal(true);
                setisDeleting(true);
                setSelectedUser(user);
              }}
              className="p-2  text-red-700 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {showModal&&(
                <Modal open={showModal} onCancel={handleModalClose} footer={null}>
                    <br />
                    {approuve 
                        ?(
                            <div>
                                <p className=" font-semibold mb-4">Vous voulez vraiment {selectedUser?.approuve? "désapprouver" : "approuver"} le compte de cet utilisateur</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleModalClose}
                                            className=" p-2 border-gray-500 bg-gray-100 text-gray-700  rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={async()=>{
                                                if(selectedUser && selectedUser.id_utilisateur!=null)
                                                    await approuveUser(selectedUser?.id_utilisateur, setUtilisateurs)
                                                    await handleModalClose();
                                            }}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
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
                                                className=" p-2 border-gray-500 bg-gray-100 text-gray-700  rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={async()=>{
                                                    if(selectedUser && selectedUser.id_utilisateur!=null)
                                                        await deleteUser(selectedUser?.id_utilisateur, setUtilisateurs)
                                                        await handleModalClose();
                                                    }}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                                            > 
                                                Supprimer
                                            </button>
                                        </div>
                                    </>
                                        
                                )
                            }

                    
                </Modal>
            )}
           <div className="flex items-center justify-between py-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Gestion des Utilisateurs</h1>
                    <p className="text-gray-600">Gérez les informations de vos utilisateurs</p>  
                </div> 
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch placeholder= "Recherche..." value={searchTerm} onChange={setSearchTerm}/>
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
            <div className="w-full">
                    {groupByKey ? (
                        Object.entries(groupedUsers).map(([group, users]) => (
                                <>
                                 <p  className="font-semibold text-md bg-gray-100 py-2 px-4">{group? group.toUpperCase() : " Aucun"}</p>
                                <Row gutter={16} key={group} >
                                {users.map((user) => (
                                    <Col span={8} className="py-4"  key={user.id_utilisateur} 
                                            xs={24}
                                            sm={12}
                                            md={8}  
                                            lg={6}  
                                    >
                                    <ProfessorCard key={user.id_utilisateur } user={user} />
                                    </Col>
                                    ))}
                                </Row>
                                </>
                        ))
                    ):(
                        <Row gutter={16}>
                            {utilisateursFiltres.map((user) => (
                                <Col span={8} className="py-4"  key={user.id_utilisateur} 
                                            xs={24}
                                            sm={12}
                                            md={8} 
                                            lg={6}   
                                >
                                    <ProfessorCard key={user.id_utilisateur } user={user} />
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