'use client';
import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { UserInfo } from '@/interface/Type';
import api from '@/api/api';

type Props = {
    onScanSuccess: (data: string) => void;
};

export default function QrScanner({ onScanSuccess }: Props) {
    const scannerRef = useRef<HTMLDivElement | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [cours, setCours] = useState<{ id_cours: number }[]>([]);


    useEffect(() => {
        const userJson = sessionStorage.getItem("user");
        const user = userJson ? JSON.parse(userJson) : null;
        const userId = user?.id;

        if (userId) {
            api.get(`/utilisateur/${userId}`)
                .then(response => {
                    setUserInfo(response.data);
                    const parcoursId = response.data.etudiant?.classe?.id_parcours;
                    const niveauId = response.data.etudiant?.classe?.id_niveau;
                    const groupe = response.data.etudiant?.classe?.groupe;

                    if (parcoursId && niveauId) {
                        api.get(`/Cours/currentTimeCours/${parcoursId}/${niveauId}/${groupe}`)
                            .then(response => {
                                setCours(response.data);
                            })
                            .catch(error => {
                                console.error("Erreur lors de la récupération des cours :", error);
                            });
                    } else {
                        console.warn("L'utilisateur n'est pas un étudiant ou n'a pas de classe.");
                    }
                })
                .catch(error => {
                    console.error("Erreur lors de la récupération des données utilisateur :", error);
                });
        }
    }, []);

    const getLocation = (): Promise<{ latitude: number; longitude: number }> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    reject('Impossible d’obtenir la position GPS');
                }
            );
        });
    };

    const envoyerPresence = async (token: string, etudiantId: string, id_cours: number) => {
        try {
            const { latitude, longitude } = await getLocation();

            const response = await api.post('/presence', {
                token,
                etudiantId,
                id_cours,
                latitude,
                longitude,
            });

            alert('Présence enregistrée !');
            console.log(response.data);
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Erreur');
        }
    };


    const handleQRScan = (scannedToken: string) => {
        const matriculeEtudiant = userInfo?.etudiant?.matricule;
        // On suppose que le premier cours de la liste est le cours actuel
        const currentCours = cours.length > 0 ? cours[0] : null;

        if (matriculeEtudiant && currentCours) {
            envoyerPresence(scannedToken, matriculeEtudiant, currentCours.id_cours);
        } else if (!matriculeEtudiant) {
            alert("Impossible de récupérer le matricule de l'étudiant.");
        } else {
            alert("Aucun cours en cours n'a été trouvé.");
        }
    };

    useEffect(() => {
        if (!scannerRef.current) return;

        const scanner = new Html5QrcodeScanner(
            'reader',
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            },
            false
        );

        scanner.render(
            (decodedText, decodedResult) => {
                scanner.clear();
                handleQRScan(decodedText);
            },
            (errorMessage) => {
                console.warn(`Erreur de scan : ${errorMessage}`);
            }
        );

        return () => {
            scanner.clear().catch((error) => console.error('Clear error:', error));
        };
    }, [onScanSuccess]);

    return <div id="reader" ref={scannerRef}></div>;
}