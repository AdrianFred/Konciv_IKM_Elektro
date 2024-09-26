// import Link from "next/link";
// import { FaSignInAlt } from "react-icons/fa";
// import Image from "next/image";

// export default function Login() {
//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">
//       <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl max-w-lg w-full mx-4">
//         <div className="flex flex-col items-center text-center">
//           <Image src="/assets/images/konciv.jpg" alt="Nina Rentals" width={120} height={120} className="mb-6 rounded-full shadow-md" />
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">IKM Elektro</h2>
//           <p className="text-sm md:text-md text-gray-500 italic mb-8">100 years of expertise in motor service and electrical solutions</p>
//           <Link href="https://login.microsoftonline.com/0899aa46-5a46-44ab-b7e9-5a7c511b2883/oauth2/authorize?response_type=code&scope=openid&response_mode=query&redirect_uri=https%3A%2F%2Frentalpwa.konciv.com/dashboard&client_id=f32f0d5d-45c9-483a-ba56-609f9528d2a0&resource=https%3A%2F%2Fgraph.windows.net&nonce=63926838-6854-4c51-9a39-bb164ac72705&site_id=500879&prompt=login&state=%7B%22return_state%22%3A%22%2F%22%7D">
//             <p className="inline-flex items-center bg-green-600 text-white py-3 px-6 rounded-full shadow-md hover:bg-green-700 transform transition duration-300 ease-in-out hover:scale-105">
//               <FaSignInAlt className="mr-2" />
//               Sign In
//             </p>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleMicrosoftLogin = () => {
    // Redirect to Microsoft login URL
    window.location.href =
      "https://login.microsoftonline.com/0899aa46-5a46-44ab-b7e9-5a7c511b2883/oauth2/authorize?response_type=code&scope=openid&response_mode=query&redirect_uri=https%3A%2F%2Fkonciv-prod-ikm-elektro-app.azurewebsites.net&client_id=f32f0d5d-45c9-483a-ba56-609f9528d2a0&resource=https%3A%2F%2Fgraph.windows.net&nonce=63926838-6854-4c51-9a39-bb164ac72705&site_id=500879&prompt=login&state=%7B%22return_state%22%3A%22%2F%22%7D%22";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Image */}
        <div className="relative hidden lg:block">
          <Image src="/assets/images/background.jpg" alt="Background" fill style={{ objectFit: "cover" }} className="z-0" priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        {/* Right side - Login */}
        {/* <div className="flex items-center justify-center p-8 bg-gray-300"> */}
        {/* <div className="flex items-center justify-center p-8 bg-[#869ea5]"> */}
        <div className="flex items-center justify-center p-8 bg-[#eeeeee]">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">IKM Elektro</h2>
              <p className="mt-2 text-sm text-gray-800">Sign in to access your account</p>
            </div>
            <Button onClick={handleMicrosoftLogin} className="w-full flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.55 18.46c3.07-.35 5.45-2.96 5.45-6.1V5.55h-5.45v12.91zM5 18.46c3.07-.35 5.45-2.96 5.45-6.1V5.55H5v12.91z" />
              </svg>
              Sign in with Microsoft
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 opacity-80 text-white p-3">
        <div className="container mx-auto text-center">
          {/* <p>&copy; Powered by Konciv | 2023</p> */}
          <p>Powered by Konciv | 2024</p>
        </div>
      </footer>
    </div>
  );
}
