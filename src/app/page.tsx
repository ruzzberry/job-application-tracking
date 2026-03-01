"use client";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle, logout } from "@/lib/auth-helpers";
import { AddJobForm } from "@/components/AddJobForm";
import { JobList } from "@/components/JobList";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-blue-600"></h1>
        {user ? (
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold"
          >
            Login with Google
          </button>
        )}
      </header>

      {user ? (
        <>
          <AddJobForm />
          <JobList />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">
            Imma put the bangiest landing page here
          </p>
        </div>
      )}
    </main>
  );
}
