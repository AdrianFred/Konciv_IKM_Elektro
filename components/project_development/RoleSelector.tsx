import React, { useState, useEffect } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

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

export default function RoleSelector({ itemTypes, numberOfPersonnel, selectedPersonnel, setSelectedPersonnel, selectedCourseBundle, token, ocpKey }: any) {
  // console.log("itemTypes:", itemTypes);
  console.log("selectedCourseBundle:", selectedCourseBundle);
  const [personnelNumber, setPersonnelNumber] = useState(numberOfPersonnel);
  const [shiftMode, setShiftMode] = useState(true); // true for Day, false for Night
  const [openCategories, setOpenCategories] = useState({});
  // const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel[]>([]);
  const [openSubRows, setOpenSubRows] = useState({});
  const [openTitles, setOpenTitles] = useState({});

  const [titles, setTitles] = useState<any[]>([]);
  const [subTitles, setSubTitles] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [subCourses, setSubCourses] = useState<any[]>([]);

  // Parse Roles and Type from itemTypes.competency for courses and subCourses
  useEffect(() => {
    if (itemTypes?.competency?.propertyDefinitions) {
      const rolesProperty = itemTypes.competency.propertyDefinitions.find((prop: any) => prop.name === "Roles");
      const typeProperty = itemTypes.competency.propertyDefinitions.find((prop: any) => prop.name === "Type");

      if (rolesProperty && typeProperty) {
        const parsedRoles = JSON.parse(rolesProperty.options);
        const parsedTypes = JSON.parse(typeProperty.options);

        const newCourses = parsedRoles.map((role: any) => ({
          name: role.label,
          open: false,
        }));

        const newSubCourses = parsedTypes.map((type: any) => ({
          name: type.label,
          mainCategory: type.dependentValue,
        }));

        const initialOpenCategories = parsedRoles.reduce((acc: any, role: any) => {
          acc[role.label] = true;
          return acc;
        }, {});

        setCourses(newCourses);
        setSubCourses(newSubCourses);
        setOpenCategories(initialOpenCategories);
      }
    }
  }, [itemTypes]);

  // Parse Role and Type from itemTypes.assignedemployee for titles and subTitles
  useEffect(() => {
    if (itemTypes?.assignedemployee?.propertyDefinitions) {
      const rolesProperty = itemTypes.assignedemployee.propertyDefinitions.find((prop: any) => prop.name === "Role");
      const typeProperty = itemTypes.assignedemployee.propertyDefinitions.find((prop: any) => prop.name === "Type");

      if (rolesProperty && typeProperty) {
        const parsedRoles = JSON.parse(rolesProperty.options);
        const parsedTypes = JSON.parse(typeProperty.options);

        const newTitles = parsedRoles.map((role: any) => ({
          name: role.label,
          open: true,
        }));

        const newSubTitles = parsedTypes.map((type: any) => ({
          name: type.label,
          mainCategory: type.dependentValue,
        }));

        const initialOpenTitles = parsedRoles.reduce((acc: any, role: any) => {
          acc[role.label] = true;
          return acc;
        }, {});

        setTitles(newTitles);
        setSubTitles(newSubTitles);
        setOpenTitles(initialOpenTitles);
      }
    }
  }, [itemTypes]);

  const toggleCategory = (categoryName: string) => {
    setOpenCategories((prevState: any) => ({
      ...prevState,
      [categoryName]: !prevState[categoryName],
    }));
  };

  const toggleTitle = (titleName: string) => {
    setOpenTitles((prevState: any) => ({
      ...prevState,
      [titleName]: !prevState[titleName],
    }));
  };

  const toggleSubRows = (key: string) => {
    setOpenSubRows((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const getOpenSubCourses = (mainCourse: string) => {
    return subCourses.filter((subCourse: any) => (openCategories as any)[subCourse.mainCategory] && subCourse.mainCategory === mainCourse);
  };

  const increment = (titleKey: string) => {
    setSelectedPersonnel((prevState: any) => {
      const countTotal = prevState.length;
      const countShift = prevState.filter((person: any) => person.titleKey === titleKey && person.shift === (shiftMode ? "Day" : "Night")).length;

      // Check if we can add more personnel
      if (countTotal < personnelNumber) {
        // Initialize the courses object under Utility
        let newCourses: Course = {
          Utility: {}, // All courses will go under the "Utility" key
        };

        // Check if selectedCourseBundle contains the relevant courses under definitionId: 14825603
        const courseBundleProperty = selectedCourseBundle?.data?.propertyValues?.find((prop: any) => prop.definitionId === 14825603);

        // If the courseBundleProperty exists, parse the value string and add each course as true under Utility
        if (courseBundleProperty) {
          const courseList = courseBundleProperty.value.split(",").map((course: string) => course.trim());

          // Add each course to the Utility object as true
          courseList.forEach((course: any) => {
            (newCourses.Utility as any)[course] = true;
          });
        }

        // Create the new personnel object
        const newPersonnel: Personnel = {
          name: `${titleKey.split("-")[1]} ${countShift + 1}`,
          titleKey,
          shift: shiftMode ? "Day" : "Night",
          courses: newCourses, // Set courses under Utility
        };

        // Return the updated state with the new personnel
        return [...prevState, newPersonnel];
      }

      return prevState;
    });
  };

  const decrement = (titleKey: string) => {
    setSelectedPersonnel((prevState: any) => {
      const shift = shiftMode ? "Day" : "Night";
      const personnelForTitleAndShift = prevState.filter((person: any) => person.titleKey === titleKey && person.shift === shift);

      if (personnelForTitleAndShift.length > 0) {
        // Find the last person for this title and shift
        const lastPersonIndex = prevState.lastIndexOf(personnelForTitleAndShift[personnelForTitleAndShift.length - 1]);

        if (lastPersonIndex > -1) {
          const newState = [...prevState];
          newState.splice(lastPersonIndex, 1);
          return newState;
        }
      }
      return prevState;
    });
  };

  const handleCheckboxChange = (personIndex: number, courseName: string, subCourseName?: string) => {
    setSelectedPersonnel((prevState: any) => {
      const updatedPersonnel = [...prevState];
      const person = updatedPersonnel[personIndex];

      if (subCourseName) {
        // Toggle subcourse
        const isSubChecked = !person.courses?.[courseName]?.[subCourseName];

        // Update the subcourse
        updatedPersonnel[personIndex] = {
          ...person,
          courses: {
            ...person.courses,
            [courseName]: {
              ...person.courses[courseName],
              [subCourseName]: isSubChecked,
            },
          },
        };

        // Get subcourses related to this main course
        const relatedSubCourses = subCourses.filter((subCourse) => subCourse.mainCategory === courseName);

        // If all subcourses are now checked, set the main course to true
        const allSubCoursesChecked = relatedSubCourses.every((subCourse) => updatedPersonnel[personIndex].courses?.[courseName]?.[subCourse.name]);

        updatedPersonnel[personIndex].courses[courseName].main = allSubCoursesChecked;
      } else {
        // Toggle the main course
        const isMainChecked = !person.courses?.[courseName]?.main;

        // Get subcourses related to this main course
        const relatedSubCourses = subCourses.filter((subCourse) => subCourse.mainCategory === courseName);

        // Update the main course and subcourses
        updatedPersonnel[personIndex] = {
          ...person,
          courses: {
            ...person.courses,
            [courseName]: isMainChecked
              ? // If main is checked, set all subcourses to true
                relatedSubCourses.reduce(
                  (acc: any, subCourse) => {
                    acc[subCourse.name] = true;
                    return acc;
                  },
                  { main: true }
                )
              : // If main is unchecked, set all subcourses to false
                relatedSubCourses.reduce(
                  (acc: any, subCourse) => {
                    acc[subCourse.name] = false;
                    return acc;
                  },
                  { main: false }
                ),
          },
        };
      }

      return updatedPersonnel;
    });
  };

  const handleParentCheckboxChange = (titleKey: string, courseName: string, subCourseName?: string) => {
    setSelectedPersonnel((prevState: any) => {
      const shift = shiftMode ? "Day" : "Night";

      // Check if main or subcourse checkbox was toggled
      const isMainCheckbox = !subCourseName;

      return prevState.map((person: any) => {
        if (person.titleKey === titleKey && person.shift === shift) {
          // Get subcourses related to this main course
          const relatedSubCourses = subCourses.filter((subCourse) => subCourse.mainCategory === courseName);

          // Toggling a main course
          if (isMainCheckbox) {
            const isMainChecked = !person.courses?.[courseName]?.main;

            return {
              ...person,
              courses: {
                ...person.courses,
                [courseName]: isMainChecked
                  ? // Set all subcourses to true if main is checked
                    relatedSubCourses.reduce(
                      (acc: any, subCourse) => {
                        acc[subCourse.name] = true;
                        return acc;
                      },
                      { main: true }
                    )
                  : // Set all subcourses to false if main is unchecked
                    relatedSubCourses.reduce(
                      (acc: any, subCourse) => {
                        acc[subCourse.name] = false;
                        return acc;
                      },
                      { main: false }
                    ),
              },
            };
          } else {
            // Toggling a subcourse
            const isSubChecked = !person.courses?.[courseName]?.[subCourseName];

            const updatedPerson = {
              ...person,
              courses: {
                ...person.courses,
                [courseName]: {
                  ...person.courses[courseName],
                  [subCourseName]: isSubChecked,
                },
              },
            };

            // If all subcourses are now checked, set the main course to true
            const allSubCoursesChecked = relatedSubCourses.every((subCourse) => updatedPerson.courses?.[courseName]?.[subCourse.name]);

            updatedPerson.courses[courseName].main = allSubCoursesChecked;

            return updatedPerson;
          }
        }
        return person;
      });
    });
  };

  const handleCopyShift = () => {
    setSelectedPersonnel((prevState: any) => {
      const dayPersonnel = prevState.filter((person: any) => person.shift === "Day");
      const nightPersonnel = dayPersonnel.map((person: any) => ({
        ...person,
        shift: "Night",
        name: person.name.replace("Day", "Night"), // Update name to reflect the night shift, or adjust accordingly
      }));
      return [...prevState, ...nightPersonnel];
    });
  };

  // Calculate total assigned personnel for both shifts
  const totalAssigned = selectedPersonnel.length;
  const availableCount = personnelNumber - totalAssigned;

  console.log("selectedPersonnel:", selectedPersonnel);

  return (
    <div className="p-4 overflow-auto">
      <div className="flex items-center gap-40">
        <div className="flex gap-4 mb-4 min-w-[11.70rem]">
          <div className="flex flex-col items-center justify-end gap-4">
            <Label htmlFor="shift-mode">Day / Night</Label>
            <Switch id="shift-mode" checked={!shiftMode} onCheckedChange={(value) => setShiftMode(!value)} />
          </div>
          <div className="text-sm flex justify-end items-end cursor-pointer" onClick={handleCopyShift}>
            <span className="bg-[#dcdcdc] text-black py-1 px-3 rounded-md shadow-sm border border-[#dcdcdc]">Copy Shift</span>
          </div>
        </div>
        <div className="transform origin-bottom-left">
          <div
            className="flex flex-col items-start gap-4"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
            }}
          >
            {courses.map((category) => (
              <div key={category.name} className="flex flex-col items-start ml-10">
                <div
                  className="cursor-pointer text-sm font-bold bg-white p-1 rounded-sm min-h-60"
                  style={{ transform: "rotate(35deg)", transformOrigin: "top left" }}
                  onClick={() => toggleCategory(category.name)}
                >
                  {(openCategories as any)[category.name] ? "▲" : "▼"} {category.name}
                </div>
                {(openCategories as any)[category.name] && (
                  <div className="flex flex-col gap-2 mr-2">
                    {subCourses
                      .filter((sub) => sub.mainCategory === category.name)
                      .map((sub, subIndex) => (
                        <div
                          key={`${category.name}-${sub.name}-${subIndex}`} // Ensure unique keys
                          className="bg-white p-1 rounded-sm shadow-sm mr-2 text-sm"
                          style={{
                            transform: "rotate(35deg)",
                            transformOrigin: "top left",
                          }}
                        >
                          {sub.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right Side Titles */}
      <div className="mt-2 flex gap-4">
        <div className="flex flex-col gap-4">
          {titles.map((title, index) => (
            <div key={title.name} className="flex flex-col gap-2">
              <div className="flex items-center justify-start gap-4 mb-4">
                <div className="text-sm font-bold cursor-pointer bg-white rounded-sm p-1 shadow-sm w-48" onClick={() => toggleTitle(title.name)}>
                  {(openTitles as any)[title.name] ? "▲" : "▼"} {title.name}
                </div>
                {index === 0 && (
                  <div className="bg-white rounded-sm px-2 py-1 text-sm ml-1">
                    Available:
                    <span
                      className="font-bold"
                      style={{
                        display: "inline-block",
                        width: "2ch",
                        textAlign: "center",
                      }}
                    >
                      {availableCount}
                    </span>
                  </div>
                )}
              </div>
              {(openTitles as any)[title.name] && (
                <div className="flex flex-col gap-5 pl-6">
                  {subTitles
                    .filter((subTitle) => subTitle.mainCategory === title.name)
                    .map((subTitle: any) => {
                      const titleKey = `${title.name}-${subTitle.name}`;
                      const personnelForTitle = selectedPersonnel.filter((person: any) => person.titleKey === titleKey && person.shift === (shiftMode ? "Day" : "Night"));

                      return (
                        <div key={titleKey} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-4">
                            <div
                              className="text-sm bg-white rounded-sm p-1 shadow-sm text-center w-[10.5rem] flex items-center justify-center relative cursor-pointer"
                              onClick={() => toggleSubRows(titleKey)}
                            >
                              {personnelForTitle.length > 1 && <span className="absolute left-2">{(openSubRows as any)[titleKey] ? "▲" : "▼"}</span>}
                              <span className="mx-auto">{subTitle.name}</span>
                            </div>
                            <div className="flex items-center bg-gray-200 rounded-full p-1" style={{ minWidth: "120px" }}>
                              <button
                                onClick={() => decrement(titleKey)}
                                disabled={!personnelForTitle.length}
                                className="bg-white text-black py-1 px-2 rounded-l-full flex items-center justify-center focus:outline-none"
                                style={{ width: "30px", height: "30px" }}
                              >
                                -
                              </button>
                              <div className="py-1 bg-white text-gray-700 flex items-center justify-center border border-gray-300 rounded-sm" style={{ width: "40px", textAlign: "center" }}>
                                {personnelForTitle.length || 0}
                              </div>
                              <button
                                onClick={() => increment(titleKey)}
                                disabled={availableCount <= 0}
                                className="bg-white text-black py-1 px-2 rounded-r-full flex items-center justify-center focus:outline-none"
                                style={{ width: "30px", height: "30px" }}
                              >
                                +
                              </button>
                            </div>
                            <div className="flex flex-row gap-2">
                              <div className="flex flex-row gap-[3.5rem]">
                                {courses.map((course, courseIndex) => (
                                  <div key={`${titleKey}-${course.name}-${courseIndex}`} className="flex flex-row items-center justify-center gap-[1.80rem] ml-2">
                                    <Checkbox
                                      checked={personnelForTitle.length > 0 && personnelForTitle.every((person: any) => person.courses?.[course.name]?.main)}
                                      onCheckedChange={() => handleParentCheckboxChange(titleKey, course.name)}
                                    />
                                    {getOpenSubCourses(course.name).map((subCourse, subCourseIndex) => (
                                      <Checkbox
                                        key={`${titleKey}-${course.name}-${subCourse.name}-${subCourseIndex}`} // Ensure unique keys
                                        checked={personnelForTitle.length > 0 && personnelForTitle.every((person: any) => person.courses?.[course.name]?.[subCourse.name])}
                                        onCheckedChange={() => handleParentCheckboxChange(titleKey, course.name, subCourse.name)}
                                      />
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {personnelForTitle.length > 1 && (openSubRows as any)[titleKey] && (
                            <div className="flex flex-col pl-4 gap-2">
                              {personnelForTitle.map((person: any, i: number) => (
                                <div key={`${titleKey}-${i}-${person.name}`} className="flex items-center gap-[8.5rem]">
                                  <div className="text-sm bg-white rounded-sm p-1 shadow-sm text-center w-[10.5rem]">{person.name}</div>
                                  <div className="flex flex-row gap-[3.5rem]">
                                    {courses.map((course, courseIndex) => (
                                      <div key={`${titleKey}-${i}-${course.name}-${courseIndex}`} className="flex flex-row items-center justify-center gap-[1.80rem] ml-2">
                                        <Checkbox
                                          checked={person.courses[course.name]?.main || false}
                                          onCheckedChange={() =>
                                            handleCheckboxChange(
                                              selectedPersonnel.findIndex((p: any) => p === person),
                                              course.name
                                            )
                                          }
                                        />
                                        {getOpenSubCourses(course.name).map((subCourse, subCourseIndex) => (
                                          <Checkbox
                                            key={`${titleKey}-${i}-${course.name}-${subCourse.name}-${subCourseIndex}`} // Ensure unique keys
                                            checked={person.courses[course.name]?.[subCourse.name] || false}
                                            onCheckedChange={() =>
                                              handleCheckboxChange(
                                                selectedPersonnel.findIndex((p: any) => p === person),
                                                course.name,
                                                subCourse.name
                                              )
                                            }
                                          />
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
