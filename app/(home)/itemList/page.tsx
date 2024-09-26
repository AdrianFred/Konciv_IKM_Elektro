"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DataTable from "./data-table";
import useApi from "@/lib/getApi";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = React.useState("");
  const [ocpKey, setOcpKey] = React.useState("");

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

  if (!token || !ocpKey) {
    return null; // Render nothing or a loading spinner while checking local storage
  }

  return (
    <div className="p-8 bg-gray-100">
      <DataTable itemTypes={itemTypes} token={token} ocpKey={ocpKey} />
    </div>
  );
}
