"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "applications"),
      where("userId", "==", user.uid),
      orderBy("appliedAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  //FOR ACTIONS
  const handleUpdate = async (id: string) => {
    try {
      await updateDoc(doc(db, "applications", id), editData);
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (job: any) => {
    setEditingId(job.id);
    setEditData(job);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this entry?"))
      await deleteDoc(doc(db, "applications", id));
  };

  //FOR SEARCH FILTER
  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (jobs.length === 0)
    return (
      <p className="text-gray-500 text-center mt-10">No applications yet.</p>
    );

  return (
    <div className="mt-8 space-y-4">
      {/*FOR SEARCH BAR HERE*/}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by company or role..."
          className="w-full p-3 pl-10 border rounded-xl text-black bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Image
          src="/images/search.svg"
          alt="Search"
          width={20}
          height={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          className="border rounded-xl bg-white shadow-sm overflow-hidden text-black transition-all"
        >
          {editingId === job.id ? (
            //FOR EDITING UI //
            <div className="p-4 space-y-3 bg-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="p-2 border rounded text-sm text-black"
                  placeholder="Company Name"
                  value={editData.companyName || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, companyName: e.target.value })
                  }
                />
                <input
                  className="p-2 border rounded text-sm text-black"
                  placeholder="Position"
                  value={editData.position || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, position: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/*FOR STATUS EDITING */}
                <select
                  className="p-2 border rounded text-sm bg-white text-black"
                  value={editData.status || "Applied"}
                  onChange={(e) =>
                    setEditData({ ...editData, status: e.target.value })
                  }
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/*FOR DATE EDITING*/}
                <input
                  type="date"
                  className="p-2 border rounded text-sm text-black"
                  value={
                    editData.appliedAt?.seconds
                      ? new Date(editData.appliedAt.seconds * 1000)
                          .toISOString()
                          .split("T")[0]
                      : editData.appliedAt instanceof Date
                        ? editData.appliedAt.toISOString().split("T")[0]
                        : ""
                  }
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      appliedAt: new Date(e.target.value),
                    })
                  }
                />
                <input
                  className="p-2 border rounded text-sm text-black"
                  placeholder="Source"
                  value={editData.source || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, source: e.target.value })
                  }
                />
                <input
                  className="w-full p-2 border rounded text-sm text-black"
                  placeholder="Job URL"
                  value={editData.jobUrl || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, jobUrl: e.target.value })
                  }
                />
              </div>

              <textarea
                className="w-full p-2 border rounded h-20 text-sm text-black"
                placeholder="Description"
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleUpdate(job.id)}
                  className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-4 py-1.5 rounded text-sm hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            //FOR VIEWING MODE//
            <>
              <div className="p-4 flex justify-between items-center">
                <div
                  className="cursor-pointer flex-1"
                  onClick={() =>
                    setExpandedJob(expandedJob === job.id ? null : job.id)
                  }
                >
                  <h3 className="font-bold text-lg">{job.companyName}</h3>

                  <p className="text-sm text-gray-500">
                    {job.position} • {job.status}
                  </p>
                  <span className="font-medium text-blue-500">
                    {job.source || "Direct"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied on:{" "}
                    {job.appliedAt?.toDate
                      ? job.appliedAt.toDate().toLocaleDateString()
                      : "No date set"}
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <button
                    onClick={() => startEditing(job)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-bold transition-colors"
                  >
                    Edit
                  </button>

                  {/*TRASH CAN BUTTON*/}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete application"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {expandedJob === job.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {job.description || "No description."}
                  </p>
                  {/*HYPERLINK FOR JOB POSTING HERE*/}
                  {job.jobUrl && (
                    <div className="mt-4 pt-2 border-t border-gray-200">
                      <a
                        href={
                          job.jobUrl.startsWith("http")
                            ? job.jobUrl
                            : `https://${job.jobUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 font-bold hover:text-blue-800 transition-colors"
                      >
                        OPEN ORIGINAL POSTING
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
