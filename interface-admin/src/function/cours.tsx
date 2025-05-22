import api from "@/api/api";
import { MatiereClasse } from "./matiere";
import { Salle } from "./salle";

export interface Cours {
    id_cours: number;
    cours_debut: Date;
    cours_fin: Date;
    status: number;
    qrCodeToken: string;
    matiere_classes: MatiereClasse;
    salle: Salle;
}

export interface CoursDTO{
    cours_debut : Date;
    cours_fin : Date;
    status :number;
    salle : Salle;
    matiere_classes: MatiereClasse;
    qrCodeToken?: string;
}

export const getCours = async (setData: (data: any) => void ) => {
    try {
        const response = await api.get("/cours");
        if (response.status === 200) {
            setData(response.data);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des cours :", error);
        throw error;
    }
}

export const addCours = async (cours: CoursDTO) => {
    try {
        const response = await api.post("/cours", cours);
    } catch (error) {
        console.error("Erreur lors de l'ajout du cours :", error);
        throw error;
    }
}

export const updateCours = async (id: number, cours: Cours, setData: (data: any) => void) => {
    try {
        const response = await api.put(`/cours/${id}`, cours);
        if (response.status === 200) {
            setData(response.data);
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cours :", error);
        throw error;
    }
}

export const deleteCours = async (id: number, setData: (data: any) => void) => {
    try {
        const response = await api.delete(`/cours/${id}`);
        if (response.status === 200) {
            setData(response.data);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du cours :", error);
        throw error;
    }
}