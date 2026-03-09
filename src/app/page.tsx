"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle, logout } from "@/lib/auth-helpers";
import { AddJobForm } from "@/components/AddJobForm";
import { JobList } from "@/components/JobList";
import Image from "next/image";

export default function Home() {
  const { user, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  const theme = {
    bg: isDarkMode ? "bg-[#2A2529]" : "bg-[#F3F0E7]",
    text: isDarkMode ? "text-[#F3F0E7]" : "text-[#2A2529]",
    accent: isDarkMode ? "border-[#F3F0E7]" : "border-[#2A2529]",
    buttonBg: isDarkMode ? "bg-[#F3F0E7]" : "bg-[#2A2529]",
    buttonText: isDarkMode ? "text-[#2A2529]" : "text-[#F3F0E7]",
    navBorder: isDarkMode ? "border-[#F3F0E7]/10" : "border-[#2A2529]/10",
    navBackground: isDarkMode ? "bg-[#2A2529]" : "bg-[#F3F0E7]",
    modalOverlay: isDarkMode ? "bg-black/60" : "bg-black/40",
  };

  if (loading)
    return (
      <div
        className={`flex h-screen items-center justify-center ${theme.bg} ${theme.text} font-medium`}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    );

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${theme.bg} ${theme.text}`}
    >
      {/*ABOUT MODAL UI*/}
      {isAboutOpen && (
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center p-4 ${theme.modalOverlay} backdrop-blur-sm animate-in fade-in duration-300`}
        >
          <div
            className={`${theme.bg} ${theme.text} border-2 ${theme.accent} p-6 md:p-8 rounded-2xl max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300`}
          >
            <button
              onClick={() => setIsAboutOpen(false)}
              className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tighter">
              About the Developer
            </h2>
            <div className="space-y-4 opacity-80 text-sm md:text-base leading-relaxed">
              <p>
                Hi! This is Ruz, and I'm the developer behind{" "}
                <strong>RJT</strong>.
              </p>
              <p>
                I built this web app because I was tired of managing an Excel
                file that felt like an extra work, and jumping between different
                job board applications just to recall where I applied was
                exhausting.
              </p>
              <p>
                I wanted a dedicated space to record every job posting I applied
                for, so I can easily recall, track, and view the posting easily.
              </p>
            </div>
            <button
              onClick={() => setIsAboutOpen(false)}
              className={`mt-8 w-full py-3 rounded-full font-bold ${theme.buttonBg} ${theme.buttonText} uppercase text-xs tracking-widest`}
            >
              Back to Tracking
            </button>
          </div>
        </div>
      )}

      {/*Navbar*/}
      <nav
        className={`border-b ${theme.navBorder} ${theme.navBackground} sticky top-0 z-50`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2 flex justify-between items-center">
          <Image
            src={
              isDarkMode
                ? "/images/rjtdarkmode.png"
                : "/images/rjtlightmode.png"
            }
            alt="RJT Logo"
            width={40}
            height={40}
            className="md:w-[45px] md:h-[45px]"
          />

          <div className="flex items-center gap-2 sm:gap-4">
            {/*Dark Mode Button*/}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border-2 ${theme.accent} hover:opacity-70 transition-all`}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="md:w-[18px] md:h-[18px]"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="md:w-[18px] md:h-[18px]"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {user && (
              <button
                onClick={logout}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm font-bold border-2 ${theme.accent} ${theme.buttonBg} ${theme.buttonText} rounded-full`}
              >
                SIGN OUT
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12 md:p-4">
        {user ? (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section>
              <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-4 md:mb-6 opacity-50">
                ENTRY FORM
              </h2>
              <AddJobForm />
            </section>
            <section className={`pt-8 border-t ${theme.navBorder}`}>
              <h2 className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-4 md:mb-6 opacity-50">
                MY APPLICATIONS
              </h2>
              <JobList />
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 md:py-8 text-center space-y-6 md:space-y-8 animate-in fade-in zoom-in-95 duration-1000">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] max-w-2xl px-2">
                TRACK EVERY JOB APPLICATION
                <br className="hidden md:block" /> IN ONE PLACE.
              </h1>
              <p className="text-base md:text-xl opacity-60 max-w-lg mx-auto font-medium px-4">
                RJT helps you organize your job hunt by tracking your recorded
                companies, positions, and status - all in a clean, simple web
                app.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto px-6">
              <button
                onClick={signInWithGoogle}
                className={`${theme.buttonBg} ${theme.buttonText} w-full sm:w-auto px-8 md:px-10 py-4 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform shadow-xl`}
              >
                GET STARTED
              </button>
              <button
                onClick={() => setIsAboutOpen(true)}
                className={`${theme.buttonBg} ${theme.buttonText} w-full sm:w-auto px-8 md:px-10 py-4 rounded-full font-black text-base md:text-lg hover:scale-105 transition-transform shadow-xl`}
              >
                ABOUT
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="py-8 md:py-12 text-center opacity-30 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase px-4">
        ©{currentYear} RJT (R JOB TRACKING)
      </footer>
    </main>
  );
}
