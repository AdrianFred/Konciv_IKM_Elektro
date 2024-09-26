"use client";
import { useState, useEffect } from "react";
import { cache } from "react";

interface ItemType {
  id: string;
  name: string;
  order: number;
  // Add other properties as needed
}

interface Project {
  id: string;
  name: string;
  // Add other properties as needed
}

interface Group {
  id: string;
  name: string;
  // Add other properties as needed
}

interface Global {
  id: string;
  name: string;
  // Add other properties as needed
}

interface UseApiReturn {
  itemTypes: any;
  projects: Project[];
  groups: Group[];
  globals: Global[];
}

const fetchApiData = async (token: string, ocpKey: string, baseUrl: string) => {
  const [itemTypesResponse, projectsResponse, groupsResponse, globalResponse] = await Promise.all([
    fetch(`${baseUrl}/api/item-types?sort=order,name&size=1000`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    }),
    fetch(`${baseUrl}/api/projects?size=500&view=dropdown`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    }),
    fetch(`${baseUrl}/api/groups?size=500`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    }),
    fetch(`${baseUrl}/api/global/definition`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
        "Ocp-Apim-Subscription-Key": ocpKey,
      },
    }),
  ]);

  const itemTypesData: ItemType[] = await itemTypesResponse.json();
  const projectsData: Project[] = await projectsResponse.json();
  const groupsData: Group[] = await groupsResponse.json();
  const globalData: Global[] = await globalResponse.json();

  return { itemTypesData, projectsData, groupsData, globalData };
};

const cachedFetchApiData = cache(fetchApiData);

const useApi = (token: string, ocpKey: string): UseApiReturn => {
  const baseUrl = "https://e2e-tm-prod-services.nsg-e2e.com";
  const [itemTypes, setItemTypes] = useState<Record<string, ItemType>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [globals, setGlobals] = useState<Global[]>([]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const { itemTypesData, projectsData, groupsData, globalData } = await cachedFetchApiData(token, ocpKey, baseUrl);

          if (itemTypesData) {
            const itemTypesId = itemTypesData.reduce<Record<string, ItemType>>((acc, itemType) => {
              acc[itemType.name.toLowerCase().replace(/\s+/g, "")] = itemType;
              return acc;
            }, {});
            setItemTypes(itemTypesId);
          }

          if (projectsData) {
            setProjects(projectsData);
          }

          if (groupsData) {
            setGroups(groupsData);
          }

          if (globalData) {
            setGlobals(globalData);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [baseUrl, token, ocpKey]);

  return { itemTypes, projects, groups, globals };
};

export default useApi;
