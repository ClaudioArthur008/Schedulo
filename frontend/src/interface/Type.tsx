// Schema de données pour les informations utilisateur
type Enseignant = {
    id_enseignant: string;
    nom: string;
    prenom: string;
};

type Etudiant = {
    matricule: string;
    nom: string;
    prenom: string;
};

export type UserInfo = {
    id_utilisateur: number;
    email: string;
    role: string;
    enseignant: Enseignant | null;
    etudiant: Etudiant | null;
};