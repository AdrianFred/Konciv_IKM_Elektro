"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = React.useState("");
  const [ocpKey, setOcpKey] = React.useState("");
  const [userId, setUserId] = React.useState("");

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const ocpKeyFromStorage = localStorage.getItem("ocpKey");
    const userIdFromStorage = localStorage.getItem("userId");

    if (!tokenFromStorage || !ocpKeyFromStorage || !userIdFromStorage) {
      router.push("/login"); // Redirect to login if token or ocpKey is missing
    } else {
      setToken(JSON.parse(tokenFromStorage));
      setOcpKey(JSON.parse(ocpKeyFromStorage));
      setUserId(JSON.parse(userIdFromStorage));
    }
  }, [router]);

  if (!token || !ocpKey) {
    return null; // Render nothing or a loading spinner while checking local storage
  }

  return (
    <div>
      {/* <Image src="/assets/images/cards/admin/development.jpg" alt="Top Banner" className="w-full h-24 object-cover" width={1200} height={320} /> */}
      <Breadcrumb className="pl-2 bg-gray-200">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/?tab=resources">Resources</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Experiences</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full h-[calc(100vh-5rem)]">
        <iframe className="w-full h-full border-0" src={`https://konciv-prod-ikm-elektro-services.azurewebsites.net/employmentHistoryReport/index.html?token=${token}`}></iframe>
      </div>
    </div>
  );
}
