"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [message, setMessage] = useState("");

  // Fetch student details and job list
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/student/me", { credentials: "include" });

        if (res.status === 401) {
          router.push("/jobs/login");
          return;
        }

        const data = await res.json();
        setStudent(data);

        // Fetch jobs from backend
        const jobsRes = await fetch("/api/jobs/all");
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);

        // Fetch applied jobs count
        const appliedRes = await fetch("/api/jobs/applied-count", {
          credentials: "include",
        });
        const appliedData = await appliedRes.json();
        setAppliedCount(appliedData.count || 0);

        setLoading(false);
      } catch (err) {
        console.log(err);
        router.push("/jobs/login");
      }
    }

    fetchData();
  }, []);

  // Apply handler
  const handleApply = async (jobId) => {
    setMessage("");

    const res = await fetch("/api/jobs/apply", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Job marked as applied ✔️");
      setAppliedCount(appliedCount + 1);
    } else {
      setMessage(data.error || "Failed to apply ❌");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* WELCOME HERO */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10 mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {student?.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-600 text-lg">
          Explore the latest job opportunities curated for your branch and year.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-3xl font-bold text-blue-600">{appliedCount}</h3>
          <p className="text-gray-600">Jobs Applied</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold">{student.branch}</h3>
          <p className="text-gray-600">Branch</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold">{student.year}</h3>
          <p className="text-gray-600">Year</p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4">How this portal works</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Browse through the list of jobs below</li>
          <li>• Click “I Applied” after applying on the job link</li>
          <li>• Your application is recorded automatically</li>
          <li>• Update your profile anytime</li>
          <li>• View your application history at any moment</li>
        </ul>
      </div>

      {/* JOB LIST */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <p className="text-gray-700 text-lg">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">{job.name}</h3>
              {job.description && (
                <p className="text-gray-600 mt-2">{job.description}</p>
              )}

              <a
                href={job.link}
                className="text-blue-600 underline mt-3 inline-block"
                target="_blank"
              >
                Apply on Company Website →
              </a>

              <button
                onClick={() => handleApply(job._id)}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                I Applied
              </button>
            </div>
          ))
        )}
      </div>

      {/* SUCCESS / ERROR MESSAGE */}
      {message && (
        <div className="max-w-5xl mx-auto mt-6 p-4 bg-black text-white rounded-lg text-center">
          {message}
        </div>
      )}
    </div>
  );
}
