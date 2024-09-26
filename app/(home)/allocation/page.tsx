"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    // <div className="w-full h-screen">
    <div className="w-full h-[calc(100vh-5rem)]">
      <iframe className="w-full h-full border-0" src={`https://konciv-prod-ikm-elektro-services.azurewebsites.net/?env=prod&user=${userId}&token=${token}`}></iframe>
      {/* <iframe className="w-full h-full border-0" src={`https://resourceplanning.konciv.com/IKMElektro/allocation/index.html?env=prod&user=${userId}&token=${token}`}></iframe> */}
      {/* <iframe
        className="w-full h-full border-0"
        src={`https://resourceplanning.konciv.com/norseCutting/projectForecast/index.html?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCIsImtpZCI6IktRMnRBY3JFN2xCYVZWR0JtYzVGb2JnZEpvNCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLndpbmRvd3MubmV0IiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMDg5OWFhNDYtNWE0Ni00NGFiLWI3ZTktNWE3YzUxMWIyODgzLyIsImlhdCI6MTcyNDYyMzcxMywibmJmIjoxNzI0NjIzNzEzLCJleHAiOjE3MjQ2MjgyNDAsImFjciI6IjEiLCJhaW8iOiJBVFFBeS84WEFBQUFFeWwyRGF5alI3R0RJRm9RM2RrSXYvWWFyaGJpWnlMSEQzNHF4MVlrcUFFNklPU2JZd0MrOFl5Y00zRUdaalJGIiwiYWx0c2VjaWQiOiI1OjoxMDAzMjAwMUQ0NjY2MDdEIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6ImYzMmYwZDVkLTQ1YzktNDgzYS1iYTU2LTYwOWY5NTI4ZDJhMCIsImFwcGlkYWNyIjoiMSIsImVtYWlsIjoiZGVtb0Buc2ctZTJlLmNvbSIsImhvbWVfb2lkIjoiYzdjZjgxNWItNzhkMy00YmM3LTg0MmUtNmY4ODQyNmI0OWY2IiwiaWRwIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvZTUzYmFhYjEtYTY4Ny00ZmQ5LWJlY2MtYTRmNjBiMGM1ZjEzLyIsImlkdHlwIjoidXNlciIsImlwYWRkciI6Ijg0LjIzNC4xNjQuMTI2IiwibmFtZSI6ImRlbW8iLCJvaWQiOiI1ZTI2ZjE0Yy01YTM3LTQ4ZDgtODg1My1kZWVkZjI3YzUzYmMiLCJwdWlkIjoiMTAwMzIwMDM2NTExRDExMyIsInJoIjoiMC5BU1FBUnFxWkNFWmFxMFMzNlZwOFVSc29nd0lBQUFBQUFBQUF3QUFBQUFBQUFBQWtBQ00uIiwic2NwIjoiRGlyZWN0b3J5LkFjY2Vzc0FzVXNlci5BbGwgRGlyZWN0b3J5LlJlYWQuQWxsIERpcmVjdG9yeS5SZWFkV3JpdGUuQWxsIEdyb3VwLlJlYWQuQWxsIEdyb3VwLlJlYWRXcml0ZS5BbGwgb2ZmbGluZV9hY2Nlc3Mgb3BlbmlkIFVzZXIuSW52aXRlLkFsbCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIiwic3ViIjoib092S1F2RGx6U2IxRWd0ZWhEUDFwUWdoZXZOWGFnMVE3SVlpMXZHdjhPVSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjA4OTlhYTQ2LTVhNDYtNDRhYi1iN2U5LTVhN2M1MTFiMjg4MyIsInVuaXF1ZV9uYW1lIjoiZGVtb0Buc2ctZTJlLmNvbSIsInV0aSI6IkUxWE9EVWlSZzB1bDlDUUQydGNxQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiI1IDE4IiwieG1zX3RkYnIiOiJFVSJ9.0hpYkujOLDrHfqqyJOfE8vwImeFuc-RJkkf1KG2DTrlc6Zw9Lnh-pDsXVrMgFd5PxL1w-gCCRaQGnFF_2mMJoxGCi_ShsG_kj2Qamc-pETSGpFpugPwNjpdftxYE8GTLyUZXRAuXJT4R2QoDGTchc12LuMgrRmuP5C2l7Ar-Ht-J7iD96ZkTAvpFMgox8j0VUzdCbFkh5b1WamqsoI_l1Yedm4hX6-iwPz2V9r23YA6hHUTnnplls_ZaaUIVOHryplRtBMR3xajGgR1oBcmIE6WbV4yO8qrsV6tWZ5Rc_vqDqkEWrgE4Wxj7YMFJ0RhakbWsni1c9cV6gTCtiOJ_cw`}
      ></iframe> */}
    </div>
  );
}
