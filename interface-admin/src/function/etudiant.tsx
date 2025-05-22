import api from "@/api/axios";
import apilog from '@/api/api'

export interface Mention {
        id_mention: number
        nom_mention: string;

      }
      
export interface Parcours {
        id_parcours: number;
        nom_parcours: string;
        code_parcours: string;
        mention: Mention;
      }

export interface Niveau {
        id_niveau: string;
    }

export interface Classes {
        id_parcours: number;
        id_niveau: string;
        groupe: string;
        niveau: Niveau;
        parcours: Parcours;
    }

export interface Etudiant {
    matricule: string;
    nom: string;
    prenom: string;
    titre: number;
    classe:Classes;
}

export interface EtudiantDto {
    matricule: string;
    nom: string;
    prenom: string;
    titre: number;
    classeKey:string;
}

export const getEtudiant = async (setData: (data: Etudiant[]) => void, token:string) => {
    try {
        const response = await  api(token!).get("/Etudiant");
        setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
        throw error;
    }
}

export const add = async (etudiant: EtudiantDto, token:string) => {
    try {
        const response = await  apilog.post("/Etudiant", etudiant);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'étudiant :", error);
        throw error;
    }
}

export const update = async (etudiant: EtudiantDto, token:string) => {
    try {
        const response = await  api(token!).put(`/Etudiant/${etudiant.matricule}`, etudiant);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'étudiant :", error);
        throw error;
    }
}

export const remove = async (matricule: string, token:string) => {
    try {
        const response = await  api(token!).delete(`/Etudiant/${matricule}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant :", error);
        throw error;
    }
}

export const getClass = async(setData : any, token:string)=>{
    try{
        const response = await  api(token!).get(`/classe`);
        setData(response.data)
    }catch(error){
        console.error("Erreur lors de selection de classe:", error);
        throw error;
    }
}