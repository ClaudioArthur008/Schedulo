'use client'
import Notification from "@/Components/Notification";
import AttendanceChart from "@/Components/AttendanceChart";
import Evenement from "@/Components/Evenement";
import Card from "@/Components/Card";
import { useEffect, useState } from "react";
import { Etudiant, getEtudiant } from "@/function/etudiant";
import { getAll } from "@/function/ensignant";
import { getSalles } from "@/function/salle";
import { getMatiere } from "@/function/matiere";

const AdminPage = () => {
    const [etudiant, setEtudiant] = useState<Etudiant[]>([]);
    const [n_etudiant, setN_etudiant] = useState(0);
    const [n_prof, setN_prof] = useState(0);
    const [n_salle, setN_salle] = useState(0);
    const [n_matiere, setN_matiere] = useState(0);

        useEffect(() => {
            const userJson = sessionStorage.getItem("user");
            const user = userJson ? JSON.parse(userJson) : null;
            const userId = user?.id;
    
            if (userId) {
            const token = sessionStorage.getItem("token");
            getEtudiant(setEtudiant, token!);
            }
             setN_etudiant (etudiant.length);
        }, []);
  return (
    <div className=" h-screen p-4 flex gap-4 flex-col md:flex-row">

      <div className="h-full w-full lg:w-3/4 flex flex-col gap-8 ">

        <div className="flex gap-4 justify-between flex-wrap ">
          <Card type="étudiant"  />
          <Card type="proffesseur" />
          <Card type="salle" />
          <Card type="matière"/>
        </div>

        <div className="w-full h-[700px]">
          <AttendanceChart />
        </div>

      </div>

      <div className="h-full w-full lg:w-1/4 flex flex-col gap-4 ">
        <Evenement />
        <Notification/>
      </div>

    </div>
  );
};

export default AdminPage;