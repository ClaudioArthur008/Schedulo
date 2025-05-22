import api from "@/api/axios";
import apilog from '@/api/api'
import { Niveau, Parcours } from "./etudiant";
import { Proffesseur } from "./user";
  export interface Classe {
        id_parcours: number;
        id_niveau: string;
        groupe: string;
        niveau: Niveau;
        parcours: Parcours;
    }
    

export interface Matiere {
    id_matiere: number;
    nom_matiere: string;
}

export interface MatiereClasse {
    id_mc: number;
    matiere: Matiere;
    classe : Classe;
    enseignant : Proffesseur;
}

export const getMatiere = async ( token:string) => {
    try {
        const response = await  api(token!).get("/matiere");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
        throw error;
    }
}

export const addMatiere = async (matiere: Matiere, token:string) => {
    try {
        const response = await  api(token!).post("/matiere", matiere);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la matière :", error);
        throw error;
    }
}

export const updateMatiere = async (matiere: Matiere, token:string) => {
    try {
        const response = await  api(token!).put(`/matiere/${matiere.id_matiere}`, matiere);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la matière :", error);
        throw error;
    }
}

export const removeMatiere = async (id: number, token:string) => {
    try {
        const response = await  api(token!).delete(`/matiere/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de la matière :", error);
        throw error;
    }
}

export const getMatiereClasse = async (setData: (data: any) => void) => {
    try {
        const response = await  apilog.get("/matiere_classe");
        setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
        throw error;
    }
}
export const getProfMatiere = async (setData: (data: any) => void, id : string) => {
    try {
        const response = await  apilog.get(`/matiere_classe/enseignantmatiere/${id}`);
        setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
        throw error;
    }
}



export const addMatiereClasse = async (data: MatiereClasse, setData: (data: any) => void) => {
    try {
        const response = await  apilog.post("/matiere_classe", data);
        getMatiereClasse(setData);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la matière :", error);
        throw error;
    }
}

export const updateMatiereClasse = async (data: MatiereClasse, setData: (data: any) => void) => {
    try {
        const response = await  apilog.put(`/matiere_classe/${data.id_mc}`, data);
        getMatiereClasse(setData);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la matière :", error);
        throw error;
    }
}

export const removeMatiereClasse = async (id: number, setData: (data: any) => void) => {
    try {
        const response = await  apilog.delete(`/matiere_classe/${id}`);
        getMatiereClasse(setData);
    } catch (error) {
        console.error("Erreur lors de la suppression de la matière :", error);
        throw error;
    }
}