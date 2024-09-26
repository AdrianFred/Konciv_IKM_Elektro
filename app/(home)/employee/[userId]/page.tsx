"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useApi from "@/lib/getApi";
import { fetchItems, fetchLinkedItems, fetchData } from "@/lib/api";
import { getEventLogs } from "@/lib/employee/actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Image from "next/image";
import EmployeeDetail from "@/components/employee/EmployeeDetail";
import EmployeeInterviewNotes from "@/components/employee/EmployeeInterviewNotes";
import { EmployeeCharts } from "@/components/employee/EmployeeCharts";
import PersonalPreferences from "@/components/employee/PersonalPreferences";
import "./style.css";
import Courses from "@/components/employee/Courses";
import Experience from "@/components/employee/Experience";
import Comments from "@/components/employee/Comments";
import LocationsWorked from "@/components/employee/LocationsWorked";
import { fetchSpecificEmployee } from "./actions";
import { Spinner } from "@/components/spinner"; // Adjust the path

export default function Page({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ocpKey, setOcpKey] = useState("");
  const [data, setData] = useState<any>(null);
  const [linkedItems, setLinkedItems] = useState(null);
  const [eventLogs, setEventLogs] = useState(null);
  const [experienceGroups, setExperienceGroups] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { itemTypes, projects } = useApi(token, ocpKey);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const ocpKeyFromStorage = localStorage.getItem("ocpKey");

    if (!tokenFromStorage || !ocpKeyFromStorage) {
      router.push("/login"); // Redirect to login if token or ocpKey is missing
    } else {
      setToken(JSON.parse(tokenFromStorage));
      setOcpKey(JSON.parse(ocpKeyFromStorage));
    }
  }, [router]);

  const refetchLinkedItems = useCallback(
    (userId: string) => {
      fetchLinkedItems(userId, token, ocpKey)
        .then((result) => {
          setLinkedItems(result);
        })
        .catch((error) => {
          console.error("Error fetching linked items:", error);
        });
    },
    [token, ocpKey]
  );

  useEffect(() => {
    const fetchUserIdAndData = async () => {
      let userId: string | null = params.userId;

      if (userId === "null" || !userId) {
        let storedUserId: string | null = localStorage.getItem("userId");

        if (storedUserId) {
          storedUserId = storedUserId.replace(/"/g, "");

          try {
            const fetchedUserId = await fetchSpecificEmployee(itemTypes.employee, token, ocpKey, storedUserId);
            if (fetchedUserId && fetchedUserId[0].id) {
              userId = fetchedUserId[0].id;
              setData(fetchedUserId);
            } else {
              console.error("Failed to fetch or find userId.");
              return;
            }
          } catch (error) {
            console.error("Error fetching specific employee:", error);
            return;
          }
        } else {
          console.error("No userId found in local storage.");
          return;
        }
      }

      try {
        if (token && ocpKey && userId !== "null" && userId) {
          const fetchedItems = await fetchItems(userId, token, ocpKey);
          setData(fetchedItems);

          refetchLinkedItems(userId);

          const eventLogs = await getEventLogs(userId, token, ocpKey);
          setEventLogs(eventLogs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        if (token && ocpKey) {
          const fetchedExperienceGroups = await fetchData(itemTypes.experiencegroups.id, token, ocpKey);
          setExperienceGroups(fetchedExperienceGroups);
        }
      } catch (error) {
        console.error("Error fetching experience groups:", error);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchUserIdAndData();
  }, [token, ocpKey, params.userId, refetchLinkedItems, itemTypes.employee, itemTypes.experiencegroups]);

  return (
    <div className="bg-gray-200">
      <Image src="/assets/images/cards/admin/personnel.jpg" alt="Top Banner" className="w-full h-24 object-cover" width={1200} height={320} />
      <Breadcrumb className="pl-2 bg-white">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/?tab=admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Employee</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Spinner />
        </div>
      ) : (
        <div className="flex gap-4 overflow-auto pb-4">
          {/* Content loaded */}
          <div className="max-w-md min-w-[28rem] pl-3">
            <EmployeeDetail data={data} itemTypes={itemTypes} token={token} ocpKey={ocpKey} />
          </div>
          <div className="flex flex-col gap-8">
            <div className="w-[500px] h-56">
              <EmployeeInterviewNotes linkedItems={linkedItems} itemTypes={itemTypes} token={token} ocpKey={ocpKey} project={projects} employee={data} onNoteCreated={refetchLinkedItems} />
            </div>
            <div className="w-[500px] h-56 pt-10">
              <EmployeeCharts />
            </div>
          </div>
          <div className="min-w-[28rem] space-y-5">
            <PersonalPreferences linkedItems={linkedItems} itemTypes={itemTypes} token={token} ocpKey={ocpKey} />
            <LocationsWorked />
          </div>
          <div className="min-w-[28rem]">
            <Experience linkedItems={linkedItems} itemTypes={itemTypes} experienceGroups={experienceGroups} />
            <Comments eventLogs={eventLogs} item={data} token={token} ocpKey={ocpKey} />
          </div>
          <div className="">
            <Courses linkedItems={linkedItems} itemTypes={itemTypes} />
          </div>
        </div>
      )}
    </div>
  );
}
