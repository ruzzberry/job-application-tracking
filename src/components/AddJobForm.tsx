"use client";
import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function AddJobForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    source: "",
    jobUrl: "",
    description: "",
    appliedAt: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "applications"), {
        ...formData,
        userId: user.uid,
        status: "Applied",
        appliedAt: new Date(formData.appliedAt),
        createdAt: new Date(),
      });

      setFormData({
        companyName: "",
        position: "",
        source: "",
        jobUrl: "",
        description: "",
        appliedAt: new Date().toISOString().split("T")[0],
      });

      alert("Job added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to add job. Check your database rules!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/*FOR INPUTTING THE COMPANY NAME HERE*/}
        <input
          required
          className="p-2 border rounded text-black"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
        />

        {/*FOR INPUTTING THE JOB POSITION APPLIED FOR HERE*/}
        <input
          required
          className="p-2 border rounded text-black"
          placeholder="Position / Role"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
        />
        {/*FOR INPUTTING THE PLATFORM YOU USE*/}
        <input
          required
          className="p-2 border rounded text-black text-sm"
          placeholder="Platform you use to apply (e.g. GMail, LinkedIn, Indeed)"
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Date Applied
          </label>
          <input
            type="date"
            required
            className="p-2 border rounded text-black"
            value={formData.appliedAt}
            onChange={(e) =>
              setFormData({ ...formData, appliedAt: e.target.value })
            }
          />
        </div>
      </div>

      {/*FOR INSERTING THE DATE APPLIED HERE*/}

      <input
        className="w-full p-2 border rounded text-black"
        placeholder="Job Posting URL"
        value={formData.jobUrl}
        onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
      />

      <textarea
        className="w-full p-2 border rounded text-black h-24"
        placeholder="Paste job description or responsibilities here..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      <button
        type="submit"
        className="w-full bg-[#2A2529] text-white py-2 rounded-lg font-bold hover:bg-[#3A3438] transition"
      >
        Save Application
      </button>
    </form>
  );
}
