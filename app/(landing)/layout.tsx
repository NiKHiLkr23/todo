import { Suspense } from "react";
import Footer from "@/components/layout/footer";
import "./home.css";
import NavBar from "./_components/navbar";
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-cyan-100" />
      <Suspense fallback="...">
        <NavBar />{" "}
      </Suspense>
      <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
        {children}
      </main>
      <Footer />
    </>
  );
}
