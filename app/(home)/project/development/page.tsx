"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ComboSelect } from "@/components/ComboSelect";
import { MultiSelect } from "@/components/MultiSelect";
import RoleSelector from "@/components/project_development/RoleSelector";
import Modal from "@/components/Modal";

import useApi from "@/lib/getApi";
import { fetchData } from "@/lib/api";
import { createPayload } from "@/lib/payloads";
import { createItem } from "@/lib/api";
import { linkItems } from "@/lib/api";
import { createItemLinkOrderPayload } from "@/lib/payloads";

type Shift = "Day" | "Night";

interface Course {
  [key: string]: boolean | { [subKey: string]: boolean };
}

interface Personnel {
  name: string;
  titleKey: string;
  shift: Shift;
  courses: Course;
}

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [ocpKey, setOcpKey] = useState("");

  const [projectData, setProjectData] = useState<any>(null);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [courseBundleData, setCourseBundleData] = useState<any>(null);

  const [selectedClient, setSelectedClient] = useState<{ label: string; value: string } | any>("");
  const [selectedDepartment, setSelectedDepartment] = useState<{ label: string; value: string } | any>("");
  const [selectedInstallation, setSelectedInstallation] = useState<{ label: string; value: string } | any>("");
  const [selectedLocation, setSelectedLocation] = useState<{ label: string; value: string } | any>("");
  const [selectedProjectType, setSelectedProjectType] = useState<{ label: string; value: string } | any>("");
  const [selectedAgreement, setSelectedAgreement] = useState<{ label: string; value: string } | any>("");
  const [selectedAdditionalAgreement, setSelectedAdditionalAgreement] = useState<{ label: string; value: string } | any>("");
  const [selectedAllowances, setSelectedAllowances] = useState<string[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<{ label: string; value: string } | any>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectNumber, setProjectNumber] = useState("");

  const [selectedLeader, setSelectedLeader] = useState<{ label: string; value: string } | any>("");
  const [selectedCoordinator, setSelectedCoordinator] = useState<{ label: string; value: string } | any>("");
  const [selectedEngineer, setSelectedEngineer] = useState<{ label: string; value: string } | any>("");

  const [description, setDescription] = useState("");
  const [scope, setScope] = useState("");
  const [internalComments, setInternalComments] = useState("");
  const [numberOfPersonnel, setNumberOfPersonnel] = useState("");

  const [selectedRotation, setSelectedRotation] = useState<{ label: string; value: string } | any>("");
  const [selectedShift, setSelectedShift] = useState<{ label: string; value: string } | any>("");
  const [selectedCourseBundle, setSelectedCourseBundle] = useState<{ label: string; value: string } | any>("");
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [clientOptions, setClientOptions] = useState([]);
  const [installationOptions, setInstallationOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [projectTypeOptions, setProjectTypeOptions] = useState([]);
  const [agreementOptions, setAgreementOptions] = useState([]);
  const [additionalAgreementOptions, setAdditionalAgreementOptions] = useState([]);
  const [allowancesOptions, setAllowancesOptions] = useState([]);
  const [airportOptions, setAirportOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [rotationOptions, setRotationOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [courseBundleOptions, setCourseBundleOptions] = useState([]);
  const [experienceOptions, setExperienceOptions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { itemTypes, projects, groups, globals } = useApi(token, ocpKey);

  useEffect(() => {
    const fetchOptions = () => {
      if (itemTypes.project && (itemTypes.project as any).propertyDefinitions) {
        const departmentProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Department");
        const installationProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Installation");
        const locationProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Location");
        const projectTypeProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Project type");
        const agreementProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Agreement");
        const additionalAgreementProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Additional Agreement");
        const allowancesProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Allowances");
        const rotationProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Rotation");
        const shiftProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Shift");
        const experienceProperty = (itemTypes.project as any).propertyDefinitions.find((propertyDefinition: any) => propertyDefinition.name === "Experience");

        if (departmentProperty?.options) {
          const departmentOptions = JSON.parse(departmentProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setDepartmentOptions(departmentOptions);
        }

        if (installationProperty?.options) {
          const installationOptions = JSON.parse(installationProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setInstallationOptions(installationOptions);
        }

        if (locationProperty?.options) {
          const locationOptions = JSON.parse(locationProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setLocationOptions(locationOptions);
        }

        if (agreementProperty?.options) {
          const agreementOptions = JSON.parse(agreementProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setAgreementOptions(agreementOptions);
        }

        if (additionalAgreementProperty?.options) {
          const additionalAgreementOptions = JSON.parse(additionalAgreementProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setAdditionalAgreementOptions(additionalAgreementOptions);
        }

        if (allowancesProperty?.options) {
          const allowancesOptions = JSON.parse(allowancesProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setAllowancesOptions(allowancesOptions);
        }

        if (rotationProperty?.options) {
          const rotationOptions = JSON.parse(rotationProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setRotationOptions(rotationOptions);
        }

        if (shiftProperty?.options) {
          const shiftOptions = JSON.parse(shiftProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setShiftOptions(shiftOptions);
        }

        if (itemTypes.experience) {
          // Parse the field options from the experience property definitions
          const fieldOptions = JSON.parse((itemTypes as any).experience.propertyDefinitions.find((prop: any) => prop.name === "Field")?.options || "[]");

          // Map over the field options to create the experience options
          let combinedExperienceOptions = fieldOptions.map((field: any, index: number) => ({
            label: field.label,
            value: `${field.label}-${index}`, // Ensure the value is unique by appending the index
            key: `field-${index}-${field.label}`, // Adding a unique key
          }));

          // Check for subfields
          const subFieldDefinition = (itemTypes as any).experience.propertyDefinitions.find((prop: any) => prop.name === "Subfield");

          if (subFieldDefinition && subFieldDefinition.options) {
            const subFieldOptions = JSON.parse(subFieldDefinition.options);

            // Filter and map subfields based on their dependent values
            const flatSubFieldOptions = subFieldOptions
              .filter((subField: any) => fieldOptions.some((field: any) => field.label === subField.dependentValue))
              .map((subField: any, index: number) => ({
                label: `${subField.dependentValue} - ${subField.label}`, // Combining with the dependent field
                value: `${subField.label}-${subField.dependentValue}-${index}`, // Unique value using subfield and dependent field
                key: `subfield-${index}-${subField.dependentValue}-${subField.label}`, // Adding a unique key
              }));

            // Combine the field options with subfield options
            combinedExperienceOptions = [...combinedExperienceOptions, ...flatSubFieldOptions];
          }

          // Set the experience options
          setExperienceOptions(combinedExperienceOptions);
        }

        if (projectTypeProperty?.options) {
          const projectTypeOptions = JSON.parse(projectTypeProperty.options).map((option: any) => ({
            label: option.label,
            value: option.value,
          }));
          setProjectTypeOptions(projectTypeOptions);
        }
      }

      // Fetch client options using Promises
      if (itemTypes.client) {
        fetchData(itemTypes.client.id, token, ocpKey)
          .then((clientResponse) => {
            if (clientResponse) {
              const clientOptions = clientResponse.map((client: any) => ({
                label: client.name,
                value: client.id.toString(), // Convert the ID to a string for consistency
              }));
              setClientOptions(clientOptions);
            } else {
              console.error("Error fetching client data:", clientResponse);
            }
          })
          .catch((error) => {
            console.error("Error fetching client data:", error);
          });
      }

      if (itemTypes.airport) {
        fetchData(itemTypes.airport.id, token, ocpKey)
          .then((airportResponse) => {
            if (airportResponse) {
              const airportOptions = airportResponse.map((airport: any) => ({
                label: airport.name,
                value: airport.id.toString(), // Convert the ID to a string for consistency
              }));
              setAirportOptions(airportOptions);
            } else {
              console.error("Error fetching airport data:", airportResponse);
            }
          })
          .catch((error) => {
            console.error("Error fetching airport data:", error);
          });
      }

      if (itemTypes.project) {
        fetchData(itemTypes.project.id, token, ocpKey)
          .then((projectResponse) => {
            if (projectResponse) {
              setProjectData(projectResponse);
            } else {
              console.error("Error fetching project data:", projectResponse);
            }
          })
          .catch((error) => {
            console.error("Error fetching project data:", error);
          });
      }

      if (itemTypes.employee) {
        fetchData(itemTypes.employee.id, token, ocpKey)
          .then((employeeResponse) => {
            if (employeeResponse) {
              const employeeOptions = employeeResponse.map((employee: any) => ({
                label: employee.name,
                value: employee.id.toString(), // Convert the ID to a string for consistency
              }));
              setEmployeeOptions(employeeOptions);
              setEmployeeData(employeeResponse);
            } else {
              console.error("Error fetching employee data:", employeeResponse);
            }
          })
          .catch((error) => {
            console.error("Error fetching employee data:", error);
          });
      }

      if (itemTypes.coursebundles) {
        fetchData(itemTypes.coursebundles.id, token, ocpKey)
          .then((courseBundleResponse) => {
            if (courseBundleResponse) {
              const courseBundleOptions = courseBundleResponse.map((courseBundle: any) => ({
                label: courseBundle.name,
                value: courseBundle.id.toString(), // Convert the ID to a string for consistency
                location: courseBundle.propertyValues.find((pv: any) => pv.definitionId === (itemTypes as any).coursebundles.propertyDefinitions.find((pd: any) => pd.name === "Location")?.id)?.value,
                data: courseBundle,
              }));
              setCourseBundleOptions(courseBundleOptions);
              setCourseBundleData(courseBundleResponse);
            } else {
              console.error("Error fetching course bundle data:", courseBundleResponse);
            }
          })
          .catch((error) => {
            console.error("Error fetching course bundle data:", error);
          });
      }
    };

    fetchOptions();
  }, [itemTypes, token, ocpKey]);

  useEffect(() => {
    if (courseBundleData && selectedLocation.value) {
      const filteredCourseBundleOptions = courseBundleData
        .filter((courseBundle: any) => {
          const locationProperty = courseBundle.propertyValues.find(
            (pv: any) => pv.definitionId === (itemTypes as any).coursebundles.propertyDefinitions.find((pd: any) => pd.name === "Location")?.id
          );
          return locationProperty?.value === selectedLocation.label;
        })
        .map((courseBundle: any) => ({
          label: courseBundle.name,
          value: courseBundle.id.toString(),
          location: courseBundle.propertyValues.find((pv: any) => pv.definitionId === (itemTypes as any).coursebundles.propertyDefinitions.find((pd: any) => pd.name === "Location")?.id)?.value,
          data: courseBundle,
        }));

      setCourseBundleOptions(filteredCourseBundleOptions);
    }
  }, [courseBundleData, selectedLocation, itemTypes]);

  const createItemsForPersonnel = async (selectedPersonnel: any[], token: string, ocpKey: string, endDate: string, startDate: string, projectId: string, projectName: string) => {
    try {
      const rotationPattern = selectedRotation.label.match(/(\d+)\s*-\s*(\d+)\s*\((\d+)\)/);
      if (!rotationPattern) throw new Error("Invalid rotation format");

      const rotationDays = parseInt(rotationPattern[1]); // e.g., 14
      const restDays = parseInt(rotationPattern[2]); // e.g., 21
      const rotationCount = parseInt(rotationPattern[3]); // e.g., 5

      const totalCycleDays = rotationDays + restDays; // e.g., 14 + 21 = 35
      const baseDaysPerRotation = Math.floor(totalCycleDays / rotationCount); // Base number of days per rotation
      const extraDays = totalCycleDays % rotationCount; // Remaining days that need to be distributed

      const endRotationDate = moment(endDate).tz("Europe/Oslo");

      const promises = selectedPersonnel.map(async (person) => {
        const rotations = [];

        let currentStartDate = moment(startDate).tz("Europe/Oslo");
        let rotationIndex = 1; // Track which rotation we're on

        while (currentStartDate.isSameOrBefore(endRotationDate)) {
          const daysForThisRotation = baseDaysPerRotation + (rotationIndex <= extraDays ? 1 : 0);
          const currentEndDate = currentStartDate.clone().add(rotationDays - 1, "days");
          const currentRotation = ((rotationIndex - 1) % rotationCount) + 1;

          // Determine the shift based on the selected shift pattern and person's initial shift
          let shiftForThisRotation = person.shift;

          if (["Day - Night - Day", "Night - Day - Night"].includes(selectedShift.label)) {
            // Alternate every group of three rotations (based on rotationCount)
            const shiftGroup = Math.floor((rotationIndex - 1) / rotationCount); // Determine the group we're in

            if (person.shift === "Day") {
              // First three rotations are "Day", next three are "Night"
              shiftForThisRotation = shiftGroup % 2 === 0 ? "Day" : "Night";
            } else if (person.shift === "Night") {
              // First three rotations are "Night", next three are "Day"
              shiftForThisRotation = shiftGroup % 2 === 0 ? "Night" : "Day";
            }
          } else if (selectedShift.label === "24:00 - 12:00" || selectedShift.label === "12:00 - 24:00") {
            // If the shift is 24:00 - 12:00, rotate between Day and Night
            shiftForThisRotation = selectedShift.label;
          }

          const updates = [
            { name: "Start date", value: currentStartDate.format("YYYY-MM-DDTHH:mm:ssZ") },
            { name: "End date", value: currentEndDate.format("YYYY-MM-DDTHH:mm:ssZ") },
            { name: "Role", value: person.titleKey.split("-")[0] },
            { name: "Type", value: person.titleKey.split("-")[1] },
            { name: "Course Bundle", value: JSON.stringify([{ id: selectedCourseBundle.data.id, name: selectedCourseBundle.data.name }]) },
            { name: "Rotation", value: currentRotation },
            { name: "Rotation Type", value: selectedRotation.label },
            { name: "Shift", value: shiftForThisRotation }, // Set the correct shift based on alternating logic
            { name: "Courses", value: JSON.stringify(person.courses) },
            { name: "Experience", value: selectedExperience.map((exp) => exp.split("-")[0].trim()).join(", ") },
            { name: "Project", value: JSON.stringify([{ id: projectId, name: projectName }]) },
          ];

          const payload = createPayload({
            itemName: `${person.name} - Rotation ${currentRotation}`,
            itemType: itemTypes.assignedemployee,
            project: projects,
            updates: updates,
          });

          console.log("Payload for rotation", currentRotation, ":", payload);

          rotations.push(createItem(token, ocpKey, payload));
          rotationIndex++;
          currentStartDate = currentStartDate.clone().add(daysForThisRotation, "days");
        }

        return Promise.all(rotations);
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("Error creating items for personnel:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await toast.promise(
      (async () => {
        const updates = [
          // List Properties
          { name: "Department", value: selectedDepartment.label },
          { name: "Installation", value: selectedInstallation.label },
          { name: "Project type", value: selectedProjectType.label },
          { name: "Agreement", value: selectedAgreement.label },
          { name: "Additional Agreement", value: selectedAdditionalAgreement.label },
          { name: "Rotation", value: selectedRotation.label },
          { name: "Shift", value: selectedShift.label },
          { name: "Course Bundle", value: selectedCourseBundle.label },
          { name: "Experience", value: selectedExperience.join(",") },
          { name: "Allowances", value: selectedAllowances.join(",") },
          { name: "Location", value: selectedLocation.label },

          // Date Properties
          { name: "Start date", value: moment(startDate).tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ") },
          { name: "End date", value: moment(endDate).tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ") },

          // Reference Properties
          { name: "Client", value: selectedClient ? JSON.stringify([{ id: selectedClient.value, name: selectedClient.label }]) : null },
          { name: "Airport", value: selectedAirport ? JSON.stringify([{ id: selectedAirport.value, name: selectedAirport.label }]) : null },
          { name: "Project Leader", value: selectedLeader ? JSON.stringify([{ id: selectedLeader.value, name: selectedLeader.label }]) : null },
          { name: "Project Coordinator", value: selectedCoordinator ? JSON.stringify([{ id: selectedCoordinator.value, name: selectedCoordinator.label }]) : null },
          { name: "Project Engineer", value: selectedEngineer ? JSON.stringify([{ id: selectedEngineer.value, name: selectedEngineer.label }]) : null },

          // Text Properties
          { name: "Description", value: description },
          { name: "Scope of work", value: scope },
          { name: "Internal Comments", value: internalComments },
          { name: "Number of Personnel", value: numberOfPersonnel },
        ];

        const rotationPattern = selectedRotation.label.match(/(\d+)\s*-\s*(\d+)\s*\((\d+)\)/);
        if (!rotationPattern) throw new Error("Invalid rotation format");

        const rotationCount = parseInt(rotationPattern[3]); // e.g., 5

        const workAssignmentUpdates = [
          { name: "Start date", value: moment(startDate).tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ") },
          { name: "End date", value: moment(endDate).tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ") },
          { name: "Type", value: selectedProjectType.label },
          { name: "Rotation Count", value: rotationCount },
          { name: "Rotation", value: selectedRotation.label },
          { name: "Shift", value: selectedShift.label },
        ];

        const payload = createPayload({
          itemName: projectNumber,
          itemType: itemTypes.project,
          project: projects,
          updates: updates,
        });

        console.log("Payload to be submitted:", payload);

        const workAssignmentPayload = createPayload({
          itemName: "<Empty>",
          itemType: itemTypes.workassignment,
          project: projects,
          updates: workAssignmentUpdates,
        });

        const createItemResponse = await createItem(token, ocpKey, payload);

        if (createItemResponse[0]?.name === projectNumber) {
          const createWorkAssignmentResponse = await createItem(token, ocpKey, workAssignmentPayload);

          // Linking work assignment to project
          if (createWorkAssignmentResponse[0]?.name === "<Empty>") {
            const linkItemsPayload = createItemLinkOrderPayload({
              parentItems: [],
              childItems: [{ id: createWorkAssignmentResponse[0]?.id }],
              relatedItems: [],
            });
            const linkItemsResponse = await linkItems(createItemResponse[0].id, token, ocpKey, linkItemsPayload);
            if (linkItemsResponse) {
              console.log("Project and work assignment created successfully!");
            } else {
              console.log("Error linking project and work assignment!");
            }
          }

          // Remove the 'main' property from courses before sending to createItemsForPersonnel
          const sanitizedPersonnel = selectedPersonnel.map((person: any) => {
            // Create a deep copy of the personnel object to avoid mutating the original
            const newPerson = { ...person };

            // Iterate over the courses and remove 'main' and false properties
            const newCourses = {};
            Object.keys(newPerson.courses).forEach((courseName) => {
              // Filter out 'main' and properties set to false
              const courseDetails = { ...newPerson.courses[courseName] };
              const filteredCourseDetails = {};

              Object.keys(courseDetails).forEach((key) => {
                if (key !== "main" && courseDetails[key] !== false) {
                  (filteredCourseDetails as any)[key] = courseDetails[key];
                }
              });

              (newCourses as any)[courseName] = filteredCourseDetails;
            });

            // Assign the filtered courses back to the person
            newPerson.courses = newCourses;

            return newPerson;
          });

          // Create items for personnel
          const createdAssignedEmployeeItemsResponse = await createItemsForPersonnel(sanitizedPersonnel, token, ocpKey, endDate, startDate, createItemResponse[0]?.id, createItemResponse[0]?.name);

          if (createdAssignedEmployeeItemsResponse) {
            let displayOrderCounter = 1;

            const assignedEmployeeChildArray = createdAssignedEmployeeItemsResponse.flatMap((outerArray) =>
              outerArray.map((innerArray) => ({
                id: innerArray[0].id,
                displayOrder: displayOrderCounter++, // Increment displayOrder globally
              }))
            );

            // Link personnel items to work assignment
            const linkAssignedEmployeeToWorkAssignmentPayload = createItemLinkOrderPayload({
              parentItems: [],
              childItems: assignedEmployeeChildArray,
              relatedItems: [],
            });

            const assignedEmployeeToWorkAssignmentLinkResponse = await linkItems(createWorkAssignmentResponse[0].id, token, ocpKey, linkAssignedEmployeeToWorkAssignmentPayload);

            if (assignedEmployeeToWorkAssignmentLinkResponse) {
              console.log("Project, work assignment, and personnel items created successfully!");
            } else {
              throw new Error("Error linking project, work assignment, and personnel items!");
            }
          }
        } else {
          throw new Error("Error creating project!");
        }
      })(),
      {
        loading: "Creating project...",
        success: "Project, work assignment, and personnel items created successfully!",
        error: "An error occurred while creating the project.",
      }
    );

    setIsSubmitting(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log("selected shift:", selectedShift);
  console.log("selected course bundle:", selectedCourseBundle);

  return (
    <div className="mb-6">
      <Image src="/assets/images/cards/admin/development.jpg" alt="Top Banner" className="w-full h-24 object-cover" width={1200} height={320} />
      <Breadcrumb className="pl-2 bg-gray-200">
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
            <BreadcrumbPage>Project Development</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-center">
        <div className="bg-gray-100 shadow-md rounded-lg m-4 p-6 max-w-[2200px]">
          <h1 className="text-2xl font-bold text-center mb-6">Project Development</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First row */}
            <div className="flex flex-col justify-between gap-8 2xl:flex-row">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                <div className="flex flex-col items-center justify-top gap-4 pt-2">
                  <Label htmlFor="airplane-mode">Offer/Project</Label>
                  <Switch id="airplane-mode" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project number</label>
                  <input type="text" className="block w-full border border-gray-300 rounded-md p-2" value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} />
                  <p className="mt-1 text-sm text-gray-500">
                    Previous: <span className="text-gray-700">{projectData ? projectData[0]?.name : ""}</span>
                  </p>
                </div>
                {/* Short description */}
                <div className="space-y-2 md:col-span-2 xl:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Short Description</label>
                  <textarea
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Describe project description here..."
                    value={selectedInstallation && selectedClient ? `${selectedClient.label} - ${selectedInstallation.label} - ${description}` : description}
                    onChange={(e) => {
                      // Extract the description part from the updated textarea value
                      const prefix = `${selectedClient.label} - ${selectedInstallation.label} - `;
                      const newDescription = e.target.value.startsWith(prefix) ? e.target.value.slice(prefix.length) : e.target.value;

                      setDescription(newDescription);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" className="block w-full border border-gray-300 rounded-md p-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <ComboSelect options={departmentOptions} placeholder="Select Department" selectedValue={selectedDepartment} onSelect={setSelectedDepartment} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Client</label>
                  <ComboSelect options={clientOptions} placeholder="Select client..." selectedValue={selectedClient} onSelect={setSelectedClient} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Installation</label>
                  <ComboSelect options={installationOptions} placeholder="Select Installation" selectedValue={selectedInstallation} onSelect={setSelectedInstallation} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <ComboSelect options={locationOptions} placeholder="Select Location" selectedValue={selectedLocation} onSelect={setSelectedLocation} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project Type</label>
                  <ComboSelect options={projectTypeOptions} placeholder="Select Type" selectedValue={selectedProjectType} onSelect={setSelectedProjectType} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Agreement</label>
                  <ComboSelect options={agreementOptions} placeholder="Select Agreement" selectedValue={selectedAgreement} onSelect={setSelectedAgreement} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Additional Agreement</label>
                  <ComboSelect options={additionalAgreementOptions} placeholder="Select" selectedValue={selectedAdditionalAgreement} onSelect={setSelectedAdditionalAgreement} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Allowances</label>
                  <MultiSelect options={allowancesOptions} placeholder="Select Allowances" selectedValues={selectedAllowances} onChange={setSelectedAllowances} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Airport</label>
                  <ComboSelect options={airportOptions} placeholder="Select Airport" selectedValue={selectedAirport} onSelect={setSelectedAirport} />
                </div>
              </div>
              {/* Scope of work and Internal Comments */}
              <div className="flex flex-col gap-6 w-full xl:w-[800px]">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Scope of work</label>
                  <textarea className="block w-full border border-gray-300 rounded-md p-2" placeholder="Describe scope here..." value={scope} onChange={(e) => setScope(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Internal Comments</label>
                  <textarea
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder="F.eks. Kunde ønsker å ha feltingeniør og Ex i inspektør på nattskift på hver rotasjon"
                    value={internalComments}
                    onChange={(e) => setInternalComments(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
            {/* Break line */}
            <div className="h-px bg-gray-300 w-full"></div>
            <div className="flex flex-wrap gap-6 max-w-[800px]">
              {/* Column 1 */}
              <div className="flex flex-col space-y-4 flex-1 min-w-[250px]">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Rotation</label>
                  <ComboSelect options={rotationOptions} placeholder="Select Rotation" selectedValue={selectedRotation} onSelect={setSelectedRotation} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Shift</label>
                  <ComboSelect options={shiftOptions} placeholder="Select Shift" selectedValue={selectedShift} onSelect={setSelectedShift} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Number of Personnel</label>
                  <Input
                    type="number"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter number here..."
                    value={numberOfPersonnel}
                    onChange={(e) => setNumberOfPersonnel(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Course Bundle</label>
                  <ComboSelect options={courseBundleOptions} placeholder="Select Course Bundle" selectedValue={selectedCourseBundle} onSelect={setSelectedCourseBundle} />
                </div>
                <div>
                  <Button variant="outline3" type="button" onClick={openModal}>
                    Select Roles
                  </Button>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <MultiSelect options={experienceOptions} placeholder="Select Experience" selectedValues={selectedExperience} onChange={setSelectedExperience} />
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex flex-col space-y-4 flex-1 min-w-[250px]">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project Leader</label>
                  <ComboSelect options={employeeOptions} placeholder="Select" selectedValue={selectedLeader} onSelect={setSelectedLeader} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project Coordinator</label>
                  <ComboSelect options={employeeOptions} placeholder="Select" selectedValue={selectedCoordinator} onSelect={setSelectedCoordinator} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Project Engineer</label>
                  <ComboSelect options={employeeOptions} placeholder="Select" selectedValue={selectedEngineer} onSelect={setSelectedEngineer} />
                </div>
                <div>
                  {/* Another input to select end date */}
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" className="block w-full border border-gray-300 rounded-md p-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button disabled={isSubmitting} className="bg-[#7F9CA7] hover:bg-[#68818E] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Go to Project
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Modal for RoleSelector */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <RoleSelector
          itemTypes={itemTypes}
          numberOfPersonnel={numberOfPersonnel}
          selectedPersonnel={selectedPersonnel}
          setSelectedPersonnel={setSelectedPersonnel}
          selectedCourseBundle={selectedCourseBundle}
          token={token}
          ocpKey={ocpKey}
        />
      </Modal>
    </div>
  );
}
