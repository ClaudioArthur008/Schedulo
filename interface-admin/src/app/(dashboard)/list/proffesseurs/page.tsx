"use client";
import Image from "next/image";
import TableSearch from "@/Components/TableSearch";
import { useEffect, useState } from "react";
import { Dropdown, MenuProps, Modal, Space, Card, Row, Col, Select } from "antd";
import {getAll, add, update, remove} from "@/function/ensignant";
import DisponibiliteProfesseur from "@/Components/Disponibilite";
import { useRouter } from "next/navigation";
import apilog from '@/api/api'
import { UserInfo } from "@/interface/Type";
import { useSearchParams } from 'next/navigation';
import { addMatiereClasse, Classe, getMatiere, getMatiereClasse, Matiere, MatiereClasse } from "@/function/matiere";
import {UnorderedListOutlined } from "@ant-design/icons";
import {Edit2, Trash2, List, Users, BookOpen, Calendar } from 'lucide-react';
import { getClasse } from "@/function/classe";
import { getClass } from "@/function/etudiant";

const ProffesseursPage = () => {     
      interface Proffesseur {
        id_enseignant: string;
        nom: string;
        prenom: string;
        matiere_classe?: MatiereClasse[]
      }
    
    type Combinaison = {
    classe: Classe;
    matiere: Matiere;
    };
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [proffesseurs, setProffesseurs] = useState<Proffesseur[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [newProf, setNewprof] = useState<Proffesseur>({
        id_enseignant: "",
        nom: "",
        prenom: ""
    });
    const [matiere_classes, setMatiere_classes]= useState<MatiereClasse[]>([]);
    const [classes,setClasses]= useState<Classe[]>([]);
    const [matieres,setMatiere]= useState<Matiere[]>([]);
    const [newMc, setNewMc] = useState({
    matiere:{id_matiere : 0},
    classe : {
        id_parcours: 0,
        id_niveau: "",
        groupe: 0,
    },
        enseignant : {id_enseignant : ""}
    });
    const [proNotClasse, setProfNotClasse]= useState<Classe[]>([]);
    const [profMatiere, setProfMatiere] = useState<string | null>(null);
    const [profMc, setProfMc] = useState<Combinaison[]>([]);
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null);
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [oldId, setOldId]= useState<string>("")
    const [expandedProfId, setExpandedProfId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showMcModal, setShowMcModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const [filtreActuel, setFiltreActuel] = useState<string | null>(null);
    const [groupByKey, setGroupByKey] = useState<'2' | '3'| '4' | null>(null);
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search') || '';
    const allCombinations: Combinaison[] = [];

    
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
            getMatiereClasse(setMatiere_classes);
            getMatiere(token!).then((m) => setMatiere(m));
            getClass(setClasses,token!)

            }
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
        }
        
      }, []);

    const items: MenuProps['items'] = [
    {
        key: '1',
        label: 'Grouper par',
        disabled: true
    },
    {
        type: 'divider',
    },
    {
        key: '2',
        label: 'Matière',
        onClick: () => setGroupByKey('2')
    }
    ,
    {
        key: '3',
        label: 'Classe',
        onClick: () => setGroupByKey('3')

    },
    {
        type: 'divider',
    },
    {
        key: '4',
        label: 'Annuler',
        onClick: () => setGroupByKey(null)

    }
    ];

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
  
     const utilisateursFiltres = proffesseurs.filter((item) => {
        const user =item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id_enseignant.toLowerCase().includes(searchTerm.toLowerCase());
        return user;
    });

    const classeFiltres = (id:string)=>{


        const mc=matiere_classes.filter((item)=>{
            return item.enseignant.id_enseignant.toLowerCase()!=id.toLocaleLowerCase();
        })
        const mcfinal = Array.from(
                            new Map(
                                mc.map((mc) => [
                                `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}`,
                                mc.classe,
                                ])
                            ).values()
                        );
        setProfNotClasse(mcfinal);
    }

    const filteredMatieres = selectedClasse
    ? matiere_classes.filter(
        (mc) =>
          `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}` === selectedClasse
      )
    : [];

    for (const classe of classes) {
    for (const matiere of matieres) {
        allCombinations.push({ classe, matiere });
    }
    }

    const allClasseMatiere =(id: string)=>{
        const combinaisonsNonAttribuees = allCombinations.filter(({ classe, matiere }) => {
            return !matiere_classes.some((mc) =>
            mc.enseignant?.id_enseignant === id &&
            mc.classe.id_parcours === classe.id_parcours &&
            mc.classe.id_niveau === classe.id_niveau &&
            mc.classe.groupe === classe.groupe &&
            mc.matiere.id_matiere === matiere.id_matiere
            );
        });

        // Éliminer les doublons avec une clé unique
        const uniqueCombinaisonsMap = new Map<string, { classe: Classe; matiere: Matiere }>();

        for (const combi of combinaisonsNonAttribuees) {
            const key = `${combi.classe.id_parcours}-${combi.classe.id_niveau}-${combi.classe.groupe}-${combi.matiere.id_matiere}`;
            if (!uniqueCombinaisonsMap.has(key)) {
            uniqueCombinaisonsMap.set(key, combi);
            }
        }

        setProfMc(Array.from(uniqueCombinaisonsMap.values()));

    }

    

    const groupedUsers = groupByKey ? groupBy(utilisateursFiltres, user => {
        if (groupByKey === '2') return user.matiere_classe?.[0]?.matiere?.nom_matiere ?? '';
        if (groupByKey === '3') {
            const classe = user.matiere_classe?.[0]?.classe;
            return classe
                ? `${classe.id_niveau} ${classe.parcours?.code_parcours ?? ''} gp${classe.groupe ?? ''}`
                : '';
        }
        return '';
    }) : { 'Tous les proffesseurs': proffesseurs };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setFiltreActuel(e.key);
    };
      const resetModalForm = () => {
        setNewprof({
            id_enseignant: "",
            nom: "",
            prenom: "",

        });
        setIsEditing(false);
    };
    const handleModalClose = () => {
        setShowModal(false);
        setShowMcModal(false)
        resetModalForm();
    };

    const splitClasse = (classe:string)=>{
        const [id_parcours, id_niveau, groupe] = classe.split("-");
        setNewMc({
            ...newMc,
            classe:{
                id_parcours: Number(id_parcours),
                id_niveau: id_niveau,
                groupe: Number(groupe)
            },
           
        });
    };

    const handleAddMc=async ()=>{
        await addMatiereClasse(newMc, setMatiere_classes)
    }

    const ProfessorCard = ({ prof }: { prof: Proffesseur }) => (
    <div className="bg-white m-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className=" bg-black w-12 h-12  rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {prof.nom.charAt(0)}{prof.prenom.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                   {prof.nom} {prof.prenom}
                </h3>
                <p className="text-sm text-gray-500 font-mono">{prof.id_enseignant}</p>
              </div>
            </div>
            
            {prof.matiere_classe && prof.matiere_classe.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                  <BookOpen size={12} />
                  {prof.matiere_classe[0].matiere.nom_matiere}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                  <Users size={12} />
                  {prof.matiere_classe[0].classe.id_niveau} {prof.matiere_classe[0].classe.parcours.code_parcours}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setExpandedProfId(null);
              setProfMatiere(profMatiere === prof.id_enseignant ? null : prof.id_enseignant);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm"
            title="Voir matières"
          >
            <List size={16} />
            Matières
          </button>
          
          <button
            onClick={() => {
              setProfMatiere(null);
              setExpandedProfId(expandedProfId === prof.id_enseignant ? null : prof.id_enseignant);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm"
            title="Voir disponibilités"
          >
            <Calendar size={16} />
            Planning
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => {
                setNewprof(prof);
                setIsEditing(true);
                setShowModal(true);
                setOldId(prof.id_enseignant)
              }}
              className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              title="Modifier"
            >
              <Edit2 size={16} />
            </button>
            
            <button
              onClick={async() =>{ await remove(
                prof.id_enseignant, token!); 
                const newProf = await getAll(token!);
                setProffesseurs(newProf);
            }}
              className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Section Matières */}
      {profMatiere === prof.id_enseignant && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Matières enseignées</h4>
              <button onClick={()=>{ 
                        classeFiltres(prof.id_enseignant); 
                            setNewMc({...newMc, enseignant:{id_enseignant:prof.id_enseignant} });
                            setShowMcModal(true);
                            allClasseMatiere(prof.id_enseignant)
                        }} 
                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors">
                Ajouter
              </button>
            </div>
            
            <div className="space-y-3">
              {prof.matiere_classe?.map((mc) => (
                <div key={mc.id_mc} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{mc.matiere.nom_matiere}</p>
                    <p className="text-sm text-gray-500">
                      {mc.classe.id_niveau} {mc.classe.parcours.code_parcours} - Groupe {mc.classe.groupe}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {expandedProfId === prof.id_enseignant && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Planning des disponibilités</h4>
              <DisponibiliteProfesseur prof={prof.id_enseignant}/>
          </div>
        </div>
      )}
    </div>
  );


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

            {/* add abd edit modal */}
            {showModal && (
                <Modal
                  onCancel={handleModalClose} open={showModal} footer={null}>
                    <h1 className="text-2xl font-semibold py-4 border-b border-gray-500">
                        {isEditing ? "Modifier l'information de l'enseignant" : "Ajouter un enseignant"}
                    </h1>
                     <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Identifiant
                        </label>
                        <input
                        type="text"
                        value={newProf.id_enseignant}
                        onChange={(e) => setNewprof({ ...newProf, id_enseignant: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                        placeholder="ENS001"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                        </label>
                        <input
                        type="text"
                        value={newProf.nom}
                        onChange={(e) => setNewprof({ ...newProf, nom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                        placeholder="Dupont"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                        </label>
                        <input
                        type="text"
                        value={newProf.prenom}
                        onChange={(e) => setNewprof({ ...newProf, prenom: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg  "
                        placeholder="Marie"
                        />
                    </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={handleModalClose}
                            className="border border-gray-200 text-gray-700 py-2 px-4  rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md"
                            onClick={async () => {
                                if (isEditing) {
                                    await update(oldId, newProf, token!);
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
            {showMcModal && (
                <Modal
                  onCancel={handleModalClose} open={showMcModal} footer={null}>
                    <h1 className="text-2xl font-semibold py-4 border-b border-gray-500">
                        {isEditing ? "Modifier la matière enseignée" : "Assigner à une nouvelle matière"}
                    </h1>
                     <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Classe
                            </label>
                            <Select
                                placeholder="Classe"
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                    onChange={(e) => {
                                    setSelectedClasse(e);
                                    setSelectedMatiere(null);
                                    splitClasse(e)
                                }}
                            >
                                {Array.from(
                                    new Map(
                                        profMc.map(mc => [
                                            `${mc.classe.id_parcours}-${mc.classe.id_niveau}-${mc.classe.groupe}`,
                                            mc.classe
                                        ])
                                    ).values()
                                ).map((classe) => (
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matière
                            </label>
                            <Select
                                placeholder="Matière"
                                className="w-full mb-4 p-2 border border-gray-300 rounded"
                                value={selectedMatiere}
                                onChange={(e) => {
                                    setSelectedMatiere(e);
                                    setNewMc({ ...newMc, matiere: { id_matiere: Number(e)} });
                                }}
                                disabled={!selectedClasse}
                            >
                                {Array.from(
                                    new Map(
                                        profMc
                                            .filter(mc => {
                                                if (!selectedClasse) return true;
                                                const [parcours, niveau, groupe] = selectedClasse.split('-');
                                                return mc.classe.id_parcours === Number(parcours) &&
                                                    mc.classe.id_niveau === niveau &&
                                                    mc.classe.groupe === groupe;
                                            })
                                            .map(mc => [mc.matiere.id_matiere, mc.matiere])
                                    ).values()
                                ).map((matiere) => (
                                    <Select.Option
                                        key={matiere.id_matiere}
                                        value={matiere.id_matiere}
                                    >
                                        {matiere.nom_matiere}
                                    </Select.Option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={handleModalClose}
                            className="border border-gray-200 text-gray-700 py-2 px-4  rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Annuler
                        </button>
                        <button
                            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-2 px-4 rounded-md"
                            onClick={async () => {
                                if (isEditing) {

                                } else {
                                    handleAddMc()
                                }
                                getMatiereClasse(setMatiere_classes)
                            }}
                        >
                            {isEditing ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </Modal>
            )}
            <div className="flex items-center justify-between py-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Enseignants</h1>
                    <p className="text-gray-600">Gérez les informations et plannings de vos enseignants</p>  
                </div>              
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

            <div className="w-full mt-4">
                    {groupByKey ? (
                        Object.entries(groupedUsers).map(([group, users]) => (
                                <>
                                 <p  className="font-semibold text-md bg-gray-100 py-2 px-4">{group? group.toUpperCase() : " Aucun"}</p>
                                {users.map((prof) => (
                                  <ProfessorCard key={prof.id_enseignant} prof={prof} />
                                ))}
                                </>
                        ))
                    ):(
                    utilisateursFiltres.map((prof) => (
                                  <ProfessorCard key={prof.id_enseignant} prof={prof} />
                    ))
                    )
                    }
            </div>
        </div>
    )
}

export default ProffesseursPage