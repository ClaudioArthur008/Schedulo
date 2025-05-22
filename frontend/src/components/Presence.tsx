
'use client';
import { useEffect, useState } from 'react';
import styles from './disponibilite.module.css';
import { UserInfo } from '@/interface/Type';
import api from '@/api/api';
import QrScanner from './QrScanner';

interface PresenceProps {
    etudiantId: string;
    id_cours: number;
    token: string;
    latitude: number;
    longitude: number;
}

const Presence = () => {
    const [cours, setCours] = useState([]);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const [qrCode, setQrCode] = useState('');
    const [result, setResult] = useState<string | null>(null);
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
                                setQrCode(response.data.qrCodeImage);
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



    return (
        <div className={styles.container}>
            <div className={styles.disponibiliteProfesseur}>
                {qrCode ? (
                    <img src={qrCode} alt="QR Code" />
                ) : (
                    <p>QR Code non disponible</p>
                )}

            </div>

            <div>
                <h1>Scanner un QR Code</h1>
                {!result ? (
                    <QrScanner onScanSuccess={(data) => setResult(data)} />
                ) : (
                    <div>
                        <p>QR Code scanné :</p>
                        <pre>{result}</pre>
                    </div>
                )}
            </div>

        </div>
    );
}
export default Presence;