import api from "@/api/axios";
import apilog from '@/api/api'
import { Etudiant } from "./etudiant";
import { Matiere } from "./matiere";

export  interface Proffesseur {
        id_enseignant: number;
        nom: string;
        prenom: string;
      }

export interface User {
    id_utilisateur: number;
    email: string;
    role: string;
    approuve: boolean;
    enseignant?: Proffesseur;
    etudiant?: Etudiant;
}


export const getUserInfo= (setUserInfo: (arg0: any) => void)=>{
     const userJson = sessionStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            const userId = user?.id;
    
            if (userId) {
                const token = sessionStorage.getItem("token");
                 apilog.get(`/utilisateur/${userId}`)
                    .then(response => {
                        setUserInfo(response.data);
                    })
                    .catch(error => {
                        console.error("Erreur lors de la récupération des données utilisateur :", error);
                    });
            }
}

export const getUser = async (setData: (data: any) => void) => {
    try {
        const response = await apilog.get(`/utilisateur`);
        setData(response.data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
        throw error;
    }
}

export const addUser = async (user: User) => {
    try {
        const response = await apilog.post("/utilisateur", user);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur :", error);
        throw error;
    }
}

export const approuveUser = async (userId: number) => {
    try {
        const response = await apilog.put(`/utilisateur/approve/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'approbation de l'utilisateur :", error);
        throw error;
    }
}
export const deleteUser = async (userId: number) => {
    try {
        const response = await apilog.delete(`/utilisateur/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
        throw error;
    }
}
