"use client";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";



const Menu = () => {
    const router = useRouter();
 const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      sessionStorage.removeItem("user");
      sessionStorage.clear();
      localStorage.removeItem("user");
      localStorage.clear();
      try {
        router.push('/login');
      } catch (error) {
        console.error("Erreur lors de la redirection :", error);
      }
    }
  };

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Accueil",
        href: "/admin",
      },
       {
        icon: "/teacher.png",
        label: "Utilisateurs",
        href: "/list/utilisateurs",
      },
      {
        icon: "/teacher.png",
        label: "Enseignants",
        href: "/list/proffesseurs",
      },
      {
        icon: "/student.png",
        label: "Etudiants",
        href: "/list/etudiants",
      },
      {
        icon: "/student.png",
        label: "Cours",
        href: "/list/cours",
      },
      {
        icon: "/lesson.png",
        label: "Matières",
        href: "/list/matieres",
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
      },
      {
        icon: "/class.png",
        label: "Mentions",
        href: "/list/mentions",
      },
      {
        icon: "/class.png",
        label: "Parcours",
        href: "/list/parcours",
      }

    ],
  },
  {
    title: "AUTRE",
    items: [
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
      }
    ],
  },
];
  return (
    <div className="  mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-600 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if(item.label === "Logout") {
              return (
              <button
                key={item.label}
                onClick={handleLogout}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-green-100 w-full text-left"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </button>)
            }else{
                return (
                  <Link
                    href={item.href}
                    key={item.label}
                    
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-700 py-2 md:px-2 rounded-md hover:bg-green-100"
                  >
                    <Image src={item.icon} alt="" width={20} height={20} />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
