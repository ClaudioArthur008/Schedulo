import Notification from "@/Components/Notification";
import AttendanceChart from "@/Components/AttendanceChart";
import Evenement from "@/Components/Evenement";
import Card from "@/Components/Card";

const AdminPage = () => {
  return (
    <div className=" h-screen p-4 flex gap-4 flex-col md:flex-row">

      <div className="h-full w-full lg:w-3/4 flex flex-col gap-8 ">

        <div className="flex gap-4 justify-between flex-wrap ">
          <Card type="étudiant" />
          <Card type="proffesseur" />
          <Card type="salle" />
          <Card type="matière" />
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