import api from "@/api/axios";
import apilog from '@/api/api'

 export interface Proffesseur {
        id_enseignant: number;
        nom: string;
        prenom: string;
      }


export const getAll = async (token : string) => {
    try {
        const response = await  apilog.get("/Enseignant");
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des enseignants :", error);
        throw error;
    }
}

export const add = async (data : Proffesseur, token :string) => {
    try {
        const response = await  api(token!).post("/Enseignant", data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'enseignant :", error);
        throw error;
    }
}

export const update = async (id: number, data: Proffesseur, token: string) => {
    try {
        const response = await api(token!).put(`/Enseignant/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'enseignant :", error);
        throw error;
    }
}

export const remove = async (id: number,  token: string) => {
    try {
        const response = await  api(token!).delete(`/Enseignant/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'enseignant :", error);
        throw error;
    }
}