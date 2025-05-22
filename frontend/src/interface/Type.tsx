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
type Salle = {
    id_salle: number;
};

type Matiere = {
    id_matiere: number;
    nom_matiere: string;
}

type Classe = {
    id_pacrours: number;
    id_niveau: string;
    groupe: number;

};

type Matiere_classe = {
    id_mc: number;
    matiere: Matiere;
    classe: Classe;
    enseignant: Enseignant;
};

export type UserInfo = {
    id_utilisateur: number;
    email: string;
    role: string;
    enseignant: Enseignant | null;
    etudiant: Etudiant | null;
};

export type Cours = {
    id_cours: number;
    cours_debut: Date;
    cours_fin: Date;
    status: number;
    qrCodeToken: string;
    matiere_classe: Matiere_classe;
    salle: Salle;
}