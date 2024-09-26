"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

const cardVariants = {
  initial: { opacity: 1, scale: 1 },
  selected: { opacity: 0, scale: 1, y: -200, zIndex: 1 },
  hidden: { opacity: 0, scale: 0 },
};

const secondaryCardVariants = {
  initial: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1 },
};

interface Card {
  id: "projects" | "resources" | "admin";
  title: string;
  image: string;
}

interface SecondaryCard {
  id: "field" | "workshop" | "engineering" | "experiences" | "competencies" | "allocation" | "materials" | "time_and_cost" | "personnel_list" | "project_development" | "itemList" | "history_report";
  title: string;
  image: string;
  link: string;
}

export default function Home() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as Card["id"] | null;
  const [selectedCard, setSelectedCard] = useState<Card["id"] | null>(tab);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let token = localStorage.getItem("token");
    let id = localStorage.getItem("userId");
    const urlParams = new URLSearchParams(window.location.search);
    const tokenLogin = urlParams.get("token");
    const idLogin = urlParams.get("userId");
    const code = urlParams.get("code");

    if (tokenLogin && idLogin) {
      // If token and id are present in URL parameters
      token = tokenLogin;
      id = idLogin;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", id);
      setToken(token);
    } else if (token && id) {
      // If token and id are available in localStorage
      setToken(token);
    } else if (code) {
      // If code is available in URL parameters
      fetch(`https://api.konciv.com/api/oauth/code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code, redirectUrl: "https://konciv-prod-ikm-elektro-app.azurewebsites.net/" }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Token data:", data);
          if (data.accessToken) {
            localStorage.setItem("token", JSON.stringify(data.accessToken));
            localStorage.setItem("userId", JSON.stringify(data.userInfo.uniqueId.toUpperCase()));
            localStorage.setItem("ocpKey", JSON.stringify(data.ocpApimSubscriptionKey));
            setCookie("token", data.accessToken);
            setCookie("userId", data.userInfo.uniqueId.toUpperCase());
            setCookie("ocpKey", data.ocpApimSubscriptionKey);
            setToken(data.accessToken);
            router.refresh();
          } else {
            router.push("/login");
          }
        })
        .catch((error) => {
          console.error("Error fetching access token:", error);
          router.push("/login");
        });
    } else {
      // If no token, id, or code is available, redirect to login
      router.push("/login");
    }
  }, [router]);

  const handleClick = (cardId: Card["id"]) => {
    setSelectedCard(cardId);
  };

  const cards: Card[] = [
    { id: "projects", title: "Projects", image: "/assets/images/project.jpg" },
    { id: "resources", title: "Resources", image: "/assets/images/resources.jpg" },
    { id: "admin", title: "Admin", image: "/assets/images/admin.jpg" },
  ];

  const secondaryCardsMap: { [key in Card["id"]]: SecondaryCard[] } = {
    projects: [
      // { id: "field", title: "Field", image: "/assets/images/cards/projects/field.jpg", link: "/field" },
      { id: "field", title: "Field", image: "/assets/images/cards/projects/field.jpg", link: "/itemList?itemType=Project" },
      { id: "workshop", title: "Workshop", image: "/assets/images/cards/projects/workshop.jpg", link: "/workshop" },
      { id: "engineering", title: "Engineering", image: "/assets/images/cards/projects/engineering.jpg", link: "/engineering" },
    ],
    resources: [
      { id: "experiences", title: "Experiences", image: "/assets/images/cards/resources/experiences.jpg", link: "/experiences" },
      { id: "competencies", title: "Competencies", image: "/assets/images/cards/resources/competency.jpg", link: "/competencies" },
      { id: "allocation", title: "Allocation", image: "/assets/images/cards/resources/allocation.jpg", link: "/allocation" },
      { id: "materials", title: "Materials", image: "/assets/images/cards/resources/materials.jpg", link: "/materials" },
    ],
    admin: [
      { id: "time_and_cost", title: "Time and Cost", image: "/assets/images/cards/admin/time.jpg", link: "/time_and_cost" },
      { id: "personnel_list", title: "Personnel List", image: "/assets/images/cards/admin/personnel.jpg", link: "/itemList?itemType=Employee" },
      { id: "project_development", title: "Project Development", image: "/assets/images/cards/admin/development.jpg", link: "/project/development" },
      { id: "history_report", title: "History Report", image: "/assets/images/cards/admin/history.jpg", link: "/historyReport" },
      { id: "itemList", title: "Item List", image: "/assets/images/cards/resources/itemList.jpg", link: "/itemList" },
    ],
  };

  if (!token)
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-16 relative">
        <Image src="/assets/images/background.jpg" alt="Background" layout="fill" objectFit="cover" className="z-0" />
        <FaSpinner className="animate-spin text-4xl text-white z-10" />
      </div>
    );

  return (
    <main className="flex-grow flex flex-col items-center justify-center py-16 relative">
      <Image src="/assets/images/background.jpg" alt="Background" layout="fill" objectFit="cover" className="z-0" />
      {selectedCard && (
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none" onClick={() => setSelectedCard(null)}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <span className="text-lg font-semibold">{selectedCard.charAt(0).toUpperCase() + selectedCard.slice(1)}</span>
        </div>
      )}

      <div className={`flex space-x-8 ${selectedCard ? "hidden" : ""} z-10`}>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="w-52 h-52 bg-white bg-opacity-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 cursor-pointer"
            variants={cardVariants}
            initial="initial"
            animate={selectedCard === card.id ? "selected" : selectedCard ? "hidden" : "initial"}
            onClick={() => handleClick(card.id)}
          >
            <Image src={card.image} alt={card.title} width={150} height={150} className="object-contain" />
            <div className="mt-1 text-center text-lg font-semibold">{card.title}</div>
          </motion.div>
        ))}
      </div>

      {selectedCard && (
        <div className="flex space-x-8 mt-8 z-10">
          <AnimatePresence>
            {secondaryCardsMap[selectedCard].map((card) => (
              <motion.div
                key={card.id}
                className="w-52 h-52 bg-white bg-opacity-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 cursor-pointer"
                variants={secondaryCardVariants}
                initial="initial"
                animate="visible"
                exit="initial"
                onClick={() => {
                  if (card.title === "Personnel List") {
                    localStorage.setItem("itemType", "Employee");
                  } else if (card.title === "Field") {
                    localStorage.setItem("itemType", "Project");
                  }
                  window.location.href = card.link;
                }}
              >
                <Image src={card.image} alt={card.title} width={150} height={150} className="object-contain" />
                <div className="mt-1 text-center text-lg font-semibold">{card.title}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
