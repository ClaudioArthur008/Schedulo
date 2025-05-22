import api from "@/api/api";

export interface Salle{
    id_salle: string;
}

export const getSalles = async (setData: (data: any) => void) => {
    try {
        const response = await api.get("/salle");
        if (response.status === 200) {
            setData(response.data);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        throw error;
    }
}

export const getSallesAvalaible = async (setData: (data: any) => void, date : string) => {
    try {
        const response = await api.get(`/salle/avalaible/${date}`);
        if (response.status === 200) {
            setData(response.data);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des salles :", error);
        throw error;
    }
}