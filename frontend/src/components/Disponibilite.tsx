import React, { useEffect, useState } from "react";
import styles from "./disponibilite.module.css";
import axios from "axios";
import { UserInfo } from "@/interface/Type";

interface DisponibiliteItem {
  day: string;
  hour: { start: number; end: number };
  available: boolean;
  date?: string;
}

interface WeekData {
  id: string;
  label: string;
  dates: string;
  startDate: Date;
}

export default function DisponibiliteProfesseur() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentDisponibilites, setCurrentDisponibilites] = useState<DisponibiliteItem[]>([]);
  const [sentDisponibilites, setSentDisponibilites] = useState<any[]>([]);
  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  const hours = [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 14, end: 16 },
    { start: 16, end: 18 },
  ];
  const [weeks, setWeeks] = useState<WeekData[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<WeekData[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [disponibilites, setDisponibilites] = useState<Map<string, DisponibiliteItem[]>>(new Map());

  useEffect(() => {
    const userJson = sessionStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const userId = user?.id;

    if (userId) {
      axios.get(`http://localhost:3002/utilisateur/${userId}`)
        .then(response => {
          setUserInfo(response.data);
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        });
    }
  }, []);

  // Fonction pour générer les semaines à partir d'une date de début
  const generateWeeks = (startDate: Date, numberOfWeeks: number): WeekData[] => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
    const weeks: WeekData[] = [];

    for (let i = 0; i < numberOfWeeks; i++) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + i * 7);

      const end = new Date(start);
      end.setDate(start.getDate() + 4);

      weeks.push({
        id: `semaine${i + 1}`,
        label: `Semaine ${i + 1}`,
        dates: `du ${start.toLocaleDateString("fr-FR", options)} au ${end.toLocaleDateString("fr-FR", options)}`,
        startDate: new Date(start) // Stocker la date de début réelle
      });
    }

    return weeks;
  };

  // Fonction pour obtenir le prochain lundi à partir d'une date
  const getNextMonday = (fromDate: Date = new Date()): Date => {
    const day = fromDate.getDay();
    const daysUntilNextMonday = (day === 0) ? 1 : 8 - day;
    const nextMonday = new Date(fromDate);
    nextMonday.setDate(nextMonday.getDate() + daysUntilNextMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  };

  // État pour le filtre de semaine pour les disponibilités envoyées
  const [selectedSentWeekFilter, setSelectedSentWeekFilter] = useState<string>("all");

  // Convertir une date en format 'YYYY-MM-DD'
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (userInfo?.enseignant?.id_enseignant) {
      // Récupérer les disponibilités déjà envoyées
      axios.get(`http://localhost:3002/disponibilite/week/${userInfo.enseignant.id_enseignant}`)
        .then(res => {
          const disponibilitesData = res.data;
          setSentDisponibilites(disponibilitesData);

          // Extraire les dates de début de semaine déjà enregistrées
          const sentWeekStartDates = disponibilitesData.map((week: any) =>
            formatDateToString(new Date(week.debut_semaine))
          );

          // Générer les semaines à partir du prochain lundi
          const nextMonday = getNextMonday();
          const generatedWeeks = generateWeeks(nextMonday, 10);
          setWeeks(generatedWeeks);

          // Filtrer les semaines qui n'ont pas encore de disponibilités
          const availableWeeks = generatedWeeks.filter(week =>
            !sentWeekStartDates.includes(formatDateToString(week.startDate))
          );
          setAvailableWeeks(availableWeeks);

          // Initialiser les disponibilités pour toutes les semaines
          const dispoMap = new Map<string, DisponibiliteItem[]>();
          generatedWeeks.forEach(week => {
            const weekStart = new Date(week.startDate);
            const slots: DisponibiliteItem[] = [];

            for (let i = 0; i < days.length; i++) {
              const dayDate = new Date(weekStart);
              dayDate.setDate(dayDate.getDate() + i);

              hours.forEach(hour => {
                slots.push({
                  day: days[i],
                  hour,
                  available: false,
                  date: formatDateToString(dayDate)
                });
              });
            }

            dispoMap.set(week.id, slots);
          });
          setDisponibilites(dispoMap);

          // Sélectionner la première semaine disponible
          if (availableWeeks.length > 0) {
            setSelectedWeek(availableWeeks[0].id);
          }

          // Charger également les disponibilités de la semaine en cours
          axios.get(`http://localhost:3002/disponibilite/this-week/${userInfo.enseignant.id_enseignant}`)
            .then(res => {
              setCurrentDisponibilites(res.data);
            })
            .catch(err => console.error("Erreur chargement disponibilités actuelles", err));
        })
        .catch(error => {
          console.error("Erreur lors de la récupération des disponibilités :", error);
        });
    }
  }, [userInfo]);

  const isAvailable = (day: string, hour: { start: number; end: number }) => {
    const weekDispos = disponibilites.get(selectedWeek) || [];
    return (
      weekDispos.find(
        (d) =>
          d.day === day &&
          d.hour.start === hour.start &&
          d.hour.end === hour.end
      )?.available || false
    );
  };

  const toggleAvailability = (
    day: string,
    hour: { start: number; end: number }
  ) => {
    setDisponibilites((prev) => {
      const newMap = new Map(prev);
      const weekDispos = [...(newMap.get(selectedWeek) || [])];

      const index = weekDispos.findIndex(
        (d) =>
          d.day === day &&
          d.hour.start === hour.start &&
          d.hour.end === hour.end
      );

      if (index !== -1) {
        weekDispos[index] = {
          ...weekDispos[index],
          available: !weekDispos[index].available,
        };
        newMap.set(selectedWeek, weekDispos);
      }

      return newMap;
    });
  };

  const getCurrentWeek = () => {
    return weeks.find((week) => week.id === selectedWeek);
  };

  const exportDisponibilites = async () => {
    if (!userInfo || !userInfo.enseignant?.id_enseignant) {
      alert("Veuillez vous connecter d'abord");
      return;
    }

    const currentWeek = getCurrentWeek();
    if (!currentWeek) return;

    const weekDispos = disponibilites.get(selectedWeek) || [];
    const availableSlots = weekDispos.filter((d) => d.available);

    try {
      for (const slot of availableSlots) {
        if (!slot.date) continue; // Skip if no date

        const start = new Date(`${slot.date}T${slot.hour.start.toString().padStart(2, '0')}:00:00`);
        const end = new Date(`${slot.date}T${slot.hour.end.toString().padStart(2, '0')}:00:00`);

        await axios.post('http://localhost:3002/disponibilite', {
          dispo_debut: start.toISOString(),
          dispo_fin: end.toISOString(),
          enseignant: {
            id_enseignant: userInfo.enseignant.id_enseignant,
          },
        });
      }

      alert(`Exportation des disponibilités pour ${getCurrentWeek()?.label} réussie`);

      // Rafraichir les disponibilités envoyées
      if (userInfo?.enseignant?.id_enseignant) {
        axios.get(`http://localhost:3002/disponibilite/week/${userInfo.enseignant.id_enseignant}`)
          .then(res => {
            const updatedSentDisponibilites = res.data;
            setSentDisponibilites(updatedSentDisponibilites);
            // Réinitialiser le filtre pour afficher toutes les semaines après un nouvel ajout
            setSelectedSentWeekFilter("all");

            // Mettre à jour la liste des semaines disponibles
            const updatedSentWeekStartDates = updatedSentDisponibilites.map((week: any) =>
              formatDateToString(new Date(week.debut_semaine))
            );

            // Filtrer à nouveau les semaines disponibles
            const newAvailableWeeks = weeks.filter(week =>
              !updatedSentWeekStartDates.includes(formatDateToString(week.startDate))
            );
            setAvailableWeeks(newAvailableWeeks);

            // Si la semaine actuelle vient d'être envoyée, sélectionner une nouvelle semaine
            if (newAvailableWeeks.length > 0) {
              setSelectedWeek(newAvailableWeeks[0].id);
            } else {
              setSelectedWeek("");
            }
          })
          .catch(error => {
            console.error("Erreur lors de la récupération des disponibilités :", error);
          });
      }
    } catch (error) {
      console.error("Erreur lors de l'exportation des disponibilités", error);
      alert("Erreur lors de l'exportation des disponibilités");
    }
  };

  return (
    <div className={styles.disponibiliteProfesseur}>
      <div className={styles.header}>
        <h2 className={styles.title}>Saisie des disponibilités</h2>

        <div className={styles.controls}>
          {availableWeeks.length > 0 ? (
            <div className="select-wrapper">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className={styles.weekSelect}
              >
                {availableWeeks.map((week) => (
                  <option key={week.id} value={week.id}>
                    {week.label} ({week.dates})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className={styles.noWeeksMessage}>
              Toutes les semaines disponibles ont été enregistrées
            </div>
          )}

          <button
            className={styles.exportButton}
            onClick={exportDisponibilites}
            disabled={availableWeeks.length === 0 || !selectedWeek}
          >
            Enregistrer
          </button>
        </div>
      </div>

      {availableWeeks.length > 0 && selectedWeek ? (
        <>
          <div className={styles.scheduleHeader}>
            <h3 className={styles.scheduleTitle}>
              Emploi du temps {getCurrentWeek()?.dates}
            </h3>
            <div className={styles.instructions}>
              Cliquez sur un créneau pour le marquer comme disponible ou non disponible
            </div>
          </div>

          <table className={styles.timeTable}>
            <thead>
              <tr>
                <th></th>
                {hours.map((hour) => (
                  <th
                    key={`${hour.start}-${hour.end}`}
                    className={styles.hourHeader}
                  >
                    {hour.start}h - {hour.end}h
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className={styles.dayCell}>{day}</td>
                  {hours.map((hour) => {
                    const available = isAvailable(day, hour);

                    return (
                      <td
                        key={`${day}-${hour.start}`}
                        className={`${styles.timeSlot} ${available ? styles.available : ""}`}
                        onClick={() => toggleAvailability(day, hour)}
                      >
                        {available && (
                          <div className={styles.availableIndicator}>
                            Disponible
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <div className={`${styles.legendColor} ${styles.available}`}></div>
              <span>Disponible</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor}></div>
              <span>Non disponible</span>
            </div>
          </div>

          <div className={styles.instructions}>
            <p>
              Cliquez sur un créneau pour le marquer comme disponible/non
              disponible.
            </p>
          </div>
        </>
      ) : (
        <div className={styles.noWeeksAvailable}>
          <p>Aucune semaine disponible pour la saisie des disponibilités.</p>
        </div>
      )}

      {/* TABLEAU DES DISPONIBILITÉS ENVOYÉES */}
      <div className={styles.sentSection}>
        <h3>Disponibilités déjà envoyées</h3>
        {!sentDisponibilites || sentDisponibilites.length === 0 ? (
          <div className={styles.noSentDisponibilites}>
            <p className={styles.message}>Aucune disponibilité envoyée</p>
          </div>
        ) : (
          <>
            <div className={styles.filterControls}>
              <label htmlFor="weekFilter">Filtrer par semaine: </label>
              <select
                id="weekFilter"
                value={selectedSentWeekFilter}
                onChange={(e) => setSelectedSentWeekFilter(e.target.value)}
                className={styles.weekSelect}
              >
                <option value="all">Toutes les semaines</option>
                {sentDisponibilites.map((weekData, i) => (
                  <option key={i} value={i.toString()}>
                    Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}
                  </option>
                ))}
              </select>
            </div>

            {selectedSentWeekFilter === "all"
              ? sentDisponibilites.map((weekData, i) => (
                <div key={i} className={styles.weekTableWrapper}>
                  <h4>Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}</h4>
                  <table className={styles.timeTable}>
                    <thead>
                      <tr>
                        <th></th>
                        {hours.map((hour) => (
                          <th key={`${hour.start}-${hour.end}`} className={styles.hourHeader}>
                            {hour.start}h - {hour.end}h
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {days.map((day) => (
                        <tr key={day}>
                          <td className={styles.dayCell}>{day}</td>
                          {hours.map((hour) => {
                            const available = weekData.disponibilites.some((d) => {
                              const dispoDebut = new Date(d.dispo_debut);
                              const dispoFin = new Date(d.dispo_fin);
                              const dayName = dispoDebut.toLocaleDateString("fr-FR", { weekday: "short" });
                              return dayName.toLowerCase().startsWith(day.toLowerCase()) &&
                                dispoDebut.getHours() === hour.start &&
                                dispoFin.getHours() === hour.end;
                            });

                            return (
                              <td
                                key={`${day}-${hour.start}`}
                                className={`${styles.timeSlot} ${available ? styles.available : ""}`}
                              >
                                {available && <div className={styles.availableIndicator}>✔</div>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))
              : (() => {
                const weekIndex = parseInt(selectedSentWeekFilter);
                const weekData = sentDisponibilites[weekIndex];
                return (
                  <div className={styles.weekTableWrapper}>
                    <h4>Semaine du {new Date(weekData.debut_semaine).toLocaleDateString("fr-FR")}</h4>
                    <table className={styles.timeTable}>
                      <thead>
                        <tr>
                          <th></th>
                          {hours.map((hour) => (
                            <th key={`${hour.start}-${hour.end}`} className={styles.hourHeader}>
                              {hour.start}h - {hour.end}h
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {days.map((day) => (
                          <tr key={day}>
                            <td className={styles.dayCell}>{day}</td>
                            {hours.map((hour) => {
                              const available = weekData.disponibilites.some((d) => {
                                const dispoDebut = new Date(d.dispo_debut);
                                const dispoFin = new Date(d.dispo_fin);
                                const dayName = dispoDebut.toLocaleDateString("fr-FR", { weekday: "short" });
                                return dayName.toLowerCase().startsWith(day.toLowerCase()) &&
                                  dispoDebut.getHours() === hour.start &&
                                  dispoFin.getHours() === hour.end;
                              });

                              return (
                                <td
                                  key={`${day}-${hour.start}`}
                                  className={`${styles.timeSlot} ${available ? styles.available : ""}`}
                                >
                                  {available && <div className={styles.availableIndicator}>✔</div>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()
            }
          </>
        )}
      </div>
    </div>
  );
}