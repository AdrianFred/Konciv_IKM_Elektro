"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import MainTabs from "@/components/project_specific/MainTabs";
import SubTabs from "@/components/project_specific/SubTabs";
import ProjectDetail from "@/components/project_specific/ProjectDetail";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectParameters from "@/components/project_specific/dashboard/ProjectParameters";
import ProjectExperience from "@/components/project_specific/Personnel/Experience";

// APIs
import useApi from "@/lib/getApi";
import { fetchLocations, fetchItems, fetchLinkedItems } from "@/lib/api";

export default function Page({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ocpKey, setOcpKey] = useState("");
  const [projectData, setProjectData] = useState<any>(null);
  const [linkedProjectsData, setLinkedProjectsData] = useState<any>(null);
  const [assignedEmployeeData, setAssignedEmployeeData] = useState<any>(null);
  const [locations, setLocations] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [selectedSubTab, setSelectedSubTab] = useState("general");

  // Load token and ocpKey from local storage
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const ocpKeyFromStorage = localStorage.getItem("ocpKey");

    if (!tokenFromStorage || !ocpKeyFromStorage) {
      router.push("/login");
    } else {
      setToken(JSON.parse(tokenFromStorage));
      setOcpKey(JSON.parse(ocpKeyFromStorage));
    }
  }, [router]);

  const { itemTypes, projects, groups, globals } = useApi(token, ocpKey);

  // Fetch Project Data and Locations
  useEffect(() => {
    const fetchData = async () => {
      if (token && ocpKey) {
        try {
          const [projectData, locationsData, linkedProjectData] = await Promise.all([
            fetchItems(params.projectId, token, ocpKey),
            fetchLocations(params.projectId, token, ocpKey),
            fetchLinkedItems(params.projectId, token, ocpKey),
          ]);
          setProjectData(projectData);
          setLocations(locationsData);
          setLinkedProjectsData(linkedProjectData);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch project data or locations");
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [token, ocpKey, params.projectId]);

  useEffect(() => {
    if (linkedProjectsData) {
      const fetchAssignedEmployee = async () => {
        const employeeData = await fetchLinkedItems(linkedProjectsData.childItems[0].id, token, ocpKey);
        setAssignedEmployeeData(employeeData);
      };

      fetchAssignedEmployee();
    }
  }, [linkedProjectsData, token, ocpKey]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  console.log("linkedProjects:", linkedProjectsData);
  console.log("employeeData:", assignedEmployeeData);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb className="px-4 py-2 bg-white">
        <BreadcrumbList className="flex items-center space-x-1 text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/?tab=projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{projectData?.name || "Project Details"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="px-4">
        {/* Tabs and Search Bar Container */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between mt-4 space-y-4 md:space-y-2">
          {/* Tabs Container */}
          <div className="flex flex-col md:w-1/2 w-auto">
            {/* MainTabs and SubTabs grouped together */}
            <MainTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} setSelectedSubTab={setSelectedSubTab} />
            <SubTabs selectedTab={selectedTab} selectedSubTab={selectedSubTab} setSelectedSubTab={setSelectedSubTab} />
          </div>
          {/* Search Bar */}
          <SearchBar />
        </div>

        {/* Content */}
        <div className="my-8">
          {selectedTab === "dashboard" && selectedSubTab === "general" && (
            <ProjectDetail data={projectData} itemTypes={itemTypes} token={token} ocpKey={ocpKey} projects={projects} locations={locations} />
          )}
          {selectedTab === "dashboard" && selectedSubTab === "projectParameters" && <ProjectParameters projectData={projectData} />}

          {selectedTab === "personnel" && selectedSubTab === "experience" && <ProjectExperience token={token} ocpKey={ocpKey} assignedEmployeeData={assignedEmployeeData} />}
        </div>
      </div>
    </div>
  );
}

const SearchBar = () => (
  <div className="flex items-center w-full md:w-auto max-w-full space-x-2 bg-white rounded px-2 py-1 shadow-lg">
    <input type="text" placeholder="Search in Project" className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 px-2 py-1" />
    <button type="submit" className="text-gray-600 focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </div>
);

const LoadingSkeleton = () => (
  <div className="p-2">
    <Skeleton className="h-screen" />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-500 text-center mt-10 p-4 bg-red-100 rounded">
    <h2 className="text-xl font-bold mb-2">Error</h2>
    <p>{message}</p>
  </div>
);
