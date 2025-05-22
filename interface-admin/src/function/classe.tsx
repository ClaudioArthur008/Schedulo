import api from "@/api/axios";
import { Classes, Mention, Niveau, Parcours } from "./etudiant";

export interface newParcours {
    id_parcours: number;
        nom_parcours: string;
        code_parcours: string;
        mentionIdMention: number;
}

export interface newClasse {
    id_parcours: number,
    id_niveau: string,
    groupe: string,
    niveauIdNiveau: string,
    parcoursIdParcours: number
}
//niveau
export const getNiveau = async (token:string) => {
    try {
        const response = await  api(token!).get("/niveau");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des niveaux :", error);
        throw error;
    }
}

export const addNiveau = async (niveau: Niveau, token:string)=>{
    try {
        const response = await  api(token!).post("/niveau", niveau);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout du niveau :", error);
        throw error;
    }
}
export const updateNiveau = async (niveau: Niveau, token:string)=>{
    try {
        const response = await  api(token!).put(`/niveau/${niveau.id_niveau}`, niveau);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du niveau :", error);
        throw error;
    }
}

export const removeNiveau = async (id: string, token:string)=>{
    try {
        const response = await  api(token!).delete(`/niveau/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du niveau :", error);
        throw error;
    }
}

//mention
export const getMention = async (setData: (data: Mention[]) => void, token:string) => {
    try {
        const response = await  api(token!).get("/mention");
        setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des mentions :", error);
        throw error;
    }
}

export const addMention = async (mention: Mention, token:string)=>{
    try {
        const response = await  api(token!).post("/mention", mention);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la mention :", error);
        throw error;
    }
}

export const updateMention = async (mention: Mention, token:string)=>{
    try {
        const response = await  api(token!).put(`/mention/${mention}`, mention);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la mention :", error);
        throw error;
    }
}

export const removeMention = async (id: number, token:string)=>{
    try {
        const response = await  api(token!).delete(`/mention/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de la mention :", error);
        throw error;
    }
}

//parcours
export const getParcours = async (setData: (data: Parcours[]) => void, token:string) => {
    try {
        const response = await  api(token!).get("/Parcours");
         setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des parcours :", error);
        throw error;
    }
}

export const addParcours = async (parcours: newParcours, token:string)=>{
    try {
        const response = await  api(token!).post("/parcours", parcours);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout du parcours :", error);
        throw error;
    }
}

export const updateParcours = async (parcours: newParcours, token:string)=>{
    try {
        const response = await  api(token!).put(`/parcours/${parcours.id_parcours}`, parcours);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du parcours :", error);
        throw error;
    }
}

export const removeParcours = async (id: number, token:string)=>{
    try {
        const response = await  api(token!).delete(`/parcours/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression du parcours :", error);
        throw error;
    }
}

//classe
export const getClasse = async (token:string) => {
    try {
        const response = await  api(token!).get("/classe");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des classes :", error);
        throw error;
    }
}

export const addClasse = async (classe: newClasse, token:string)=>{
    try {
        const response = await  api(token!).post("/classe", classe);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de la classe :", error);
        throw error;
    }
}

export const updateClasse = async (id_p : number, id_n: string, g: string, classe : newClasse, token:string)=>{
    try {
        const response = await  api(token!).put(`/classe/${id_p}/${id_n}/${g}`, classe);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la classe :", error);
        throw error;
    }
}

export const removeClasse = async (id_p : number, id_n: string, g: string, token:string)=>{
    try {
        const response = await  api(token!).delete(`/classe/${id_p}/${id_n}/${g}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de la classe :", error);
        throw error;
    }
}
