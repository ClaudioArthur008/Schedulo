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
}

const DisponibiliteProfesseur = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [disponibilite, setDisponibilitesPerWeek] = useState<DisponibiliteItem | null>(null);
  const [sentDisponibilites, setSentDisponibilites] = useState<DisponibiliteItem[]>([]);
  const days = ["Lu", "Ma", "Me", "Je", "Ve", "Sa"];
  const hours = [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 14, end: 16 },
    { start: 16, end: 18 },
  ];

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

  useEffect(() => {
    if (userInfo?.enseignant?.id_enseignant) {
      axios.get(`http://localhost:3002/disponibilite/this-week/${userInfo.enseignant.id_enseignant}`)
        .then(res => {
          setDisponibilitesPerWeek(res.data);
        })
        .catch(err => console.error("Erreur chargement disponibilités actuelles", err));

      axios.get(`http://localhost:3002/disponibilite/this-week/${userInfo.enseignant.id_enseignant}`)
        .then(res => {
          const mapped = res.data.map((d: { dispo_debut: string; dispo_fin: string }) => ({
            day: new Date(d.dispo_debut).toLocaleDateString("fr-FR", { weekday: "short" }),
            hour: {
              start: new Date(d.dispo_debut).getHours(),
              end: new Date(d.dispo_fin).getHours(),
            },
            date: d.dispo_debut.split("T")[0],
            available: true,
          }));
          setSentDisponibilites(mapped);
        });
    }
  }, [userInfo]);

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
        dates: `du ${start.toLocaleDateString("fr-FR", options)} au ${end.toLocaleDateString("fr-FR", options)}`
      });
    }

    return weeks;
  };

  const getNextMonday = (): Date => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilNextMonday = (day === 0) ? 1 : 8 - day;
    today.setDate(today.getDate() + daysUntilNextMonday);
    return today;
  };

  const weeks = generateWeeks(getNextMonday(), 10);
  const [selectedWeek, setSelectedWeek] = useState(weeks[0]?.id || "");

  const [disponibilites, setDisponibilites] = useState<
    Map<string, DisponibiliteItem[]>
  >(
    new Map(
      weeks.map((week, i) => {
        const startDate = new Date(getNextMonday());
        startDate.setDate(startDate.getDate() + i * 7);

        const joursAvecDates = days.map((day, index) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + index);
          return { day, date };
        });

        const slots: DisponibiliteItem[] = joursAvecDates.flatMap(({ day, date }) =>
          hours.map((hour) => ({
            day,
            hour,
            available: false,
            date: date.toISOString().split("T")[0],
          }))
        );

        return [week.id, slots];
      })
    )
  );

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

  const groupByWeek = (dispos: DisponibiliteItem[]) => {
    const grouped = new Map<string, DisponibiliteItem[]>();
    dispos.forEach((item) => {
      const date = new Date(item.date!);
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      const key = monday.toISOString().split("T")[0];
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(item);
    });
    return grouped;
  };

  const exportDisponibilites = async () => {
    if (!userInfo || !userInfo.enseignant?.id_enseignant) {
      alert("Veuillez vous connecter d'abord");
      return;
    }

    const existingDispos = await axios.get(
      `http://localhost:3002/disponibilite/specific-week/${userInfo.enseignant.id_enseignant}`
    );

    if (existingDispos.data?.length > 0) {
      alert("Vous avez déjà soumis vos disponibilités pour cette semaine.");
      return;
    }

    const weekDispos = disponibilites.get(selectedWeek) || [];
    const availableSlots = weekDispos.filter((d) => d.available);

    for (const slot of availableSlots) {
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

    alert(`Exportation des disponibilités pour ${getCurrentWeek()?.label}`);
  };

  return (
    <div className={styles.disponibiliteProfesseur}>
      <div className={styles.header}>
        <h2 className={styles.title}>Saisie des disponibilités</h2>

        <div className={styles.controls}>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className={styles.weekSelect}
          >
            {weeks.map((week) => (
              <option key={week.id} value={week.id}>
                {week.label} ({week.dates})
              </option>
            ))}
          </select>

          <button
            className={styles.exportButton}
            onClick={exportDisponibilites}
          >
            Enregistrer
          </button>
        </div>
      </div>

      <div className={styles.scheduleHeader}>
        <h3 className={styles.scheduleTitle}>
          Emploi du temps {getCurrentWeek()?.dates}
        </h3>
        <div className={styles.instructions}>
          Cliquez sur un créneau pour le marquer comme disponible ou non
          disponible
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
                    className={`${styles.timeSlot} ${available ? styles.available : ""
                      }`}
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
      {/* TABLEAU DES DISPONIBILITÉS ENVOYÉES */}
      <div className={styles.sentSection}>
        <h3>Disponibilités déjà envoyées</h3>
        {[...groupByWeek(sentDisponibilites).entries()].map(([weekStart, slots], i) => (
          <div key={i} className={styles.weekTableWrapper}>
            <h4>Semaine du {new Date(weekStart).toLocaleDateString("fr-FR")}</h4>
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
                      const available: boolean = slots.some((d: DisponibiliteItem) =>
                        d.day.toLowerCase().startsWith(day.toLowerCase()) &&
                        d.hour.start === hour.start &&
                        d.hour.end === hour.end
                      );
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
        ))}
      </div>
    </div>
  );
};

export default DisponibiliteProfesseur;
