"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// -------------------- CountUp --------------------
function CountUp({ end = 0, duration = 800, className = "text-4xl font-bold" }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = Math.max(8, Math.floor(duration / 16));
    const increment = (end - start) / steps;
    let cur = start;
    const id = setInterval(() => {
      cur += increment;
      if ((increment > 0 && cur >= end) || (increment < 0 && cur <= end)) {
        setValue(end);
        clearInterval(id);
      } else {
        setValue(Math.round(cur));
      }
    }, duration / steps);
    return () => clearInterval(id);
  }, [end, duration]);
  return <div className={className}>{value}</div>;
}

// -------------------- Skeleton Card --------------------
function SkeletonCard() {
  return (
    <div className="animate-pulse p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="h-6 w-1/3 bg-gray-300 rounded mb-4" />
      <div className="h-3 w-full bg-gray-200 rounded mb-2" />
      <div className="h-3 w-5/6 bg-gray-200 rounded mb-6" />
      <div className="h-10 w-full bg-gray-300 rounded" />
    </div>
  );
}

// -------------------- Confetti --------------------
function ConfettiCanvas({ trigger }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    const colors = ["#ff6b6b", "#ffd93d", "#6bcB77", "#4D96FF", "#9D4EDD"].map((c) =>
      c.toUpperCase()
    );
    const particles = [];
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h - h / 2,
        r: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        vy: Math.random() * 3 + 2,
      });
    }

    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.tilt * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.01) * 2;
        if (p.y > h + 50) {
          p.y = -10;
          p.x = Math.random() * w;
        }
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const stopAfter = setTimeout(() => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    }, 3500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stopAfter);
      ctx.clearRect(0, 0, w, h);
    };
  }, [trigger]);

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />
  );
}

// -------------------- MAIN PAGE --------------------
export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [bookmarked, setBookmarked] = useState(new Set());
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [appliedCount, setAppliedCount] = useState(0);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [tempMessage, setTempMessage] = useState("");

  // ⛔ FIX: Per–job loading
  const [processingApplyId, setProcessingApplyId] = useState(null);
  const [processingWithdrawId, setProcessingWithdrawId] = useState(null);

  // -------------------- Load Data --------------------
  useEffect(() => {
    async function load() {
      if (!API_BASE_URL) {
        setLoading(false);
        setTimeout(() => (window.location.href = "/jobs/login"), 800);
        return;
      }
      try {
        const meRes = await fetch(`${API_BASE_URL}/api/student/me`, {
          credentials: "include",
        });
        if (meRes.status === 401) return (window.location.href = "/jobs/login");

        const me = await meRes.json();
        setStudent(me);

        const [jobsRes, appliedRes, appsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/jobs/all`),
          fetch(`${API_BASE_URL}/api/jobs/applied-count`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/jobs/my-applications`, {
            credentials: "include",
          }),
        ]);

        const jobsData = await jobsRes.json();
        const appliedData = await appliedRes.json();
        const appsData = await appsRes.json();

        const jobsList = jobsData.jobs || [];
        setJobs(jobsList);
        setFiltered(jobsList);
        setAppliedCount(appliedData.count || 0);
        setAppliedJobIds(
          new Set(
            (appsData?.applications || [])
              .map((a) => a.jobId?._id)
              .filter(Boolean)
          )
        );
      } catch (e) {
        console.error(e);
        setTempMessage("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // -------------------- Filtering --------------------
  useEffect(() => {
    let list = [...jobs];
    if (search.trim())
      list = list.filter((j) =>
        (j.name || "").toLowerCase().includes(search.toLowerCase())
      );
    if (filterType !== "all")
      list = list.filter(
        (j) => (j.type || "").toLowerCase() === filterType.toLowerCase()
      );

    if (sortBy === "latest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sortBy === "oldest")
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "az")
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    setFiltered(list);
  }, [jobs, search, filterType, sortBy]);

  const toggleBookmark = (id) =>
    setBookmarked((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  // -------------------- Apply --------------------
  const openApplyModal = (job) => {
    setJobToApply(job);
    setConfirmOpen(true);
  };

  const confirmApply = async () => {
    if (!jobToApply) return;
    setProcessingApplyId(jobToApply._id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: jobToApply._id }),
      });

      if (res.ok) {
        setAppliedJobIds((prev) => new Set(prev).add(jobToApply._id));
        setAppliedCount((prev) => prev + 1);
        setTempMessage("Successfully applied!");
        setConfettiTrigger((v) => !v);
      } else {
        const data = await res.json();
        setTempMessage(data.error || "Failed to apply");
      }
    } catch {
      setTempMessage("Network error");
    } finally {
      setConfirmOpen(false);
      setProcessingApplyId(null);
    }
  };

  // -------------------- Withdraw --------------------
  const handleWithdraw = async (id) => {
    setProcessingWithdrawId(id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs/withdraw`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: id }),
      });

      if (res.ok) {
        setAppliedJobIds((prev) => {
          const copy = new Set(prev);
          copy.delete(id);
          return copy;
        });
        setAppliedCount((prev) => prev - 1);
        setTempMessage("Application withdrawn");
      } else {
        const data = await res.json();
        setTempMessage(data.error || "Failed to withdraw");
      }
    } catch {
      setTempMessage("Network error");
    } finally {
      setProcessingWithdrawId(null);
    }
  };

  // -------------------- Temp Message --------------------
  useEffect(() => {
    if (!tempMessage) return;
    const t = setTimeout(() => setTempMessage(""), 3500);
    return () => clearTimeout(t);
  }, [tempMessage]);

  // -------------------- LOADING UI --------------------
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );

  // -------------------- UI --------------------
  return (
    <>
      <Head>
        <title>Student Job Portal — Dashboard</title>
      </Head>

      <ConfettiCanvas trigger={confettiTrigger} />

      <div className="min-h-screen bg-gray-50 pb-24 relative">

        {/* ================= HEADER ================= */}
        <header className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 rounded-b-[2rem] shadow-xl">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-4xl md:text-5xl font-extrabold"
            >
              Welcome, {student?.name} 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg mt-3 opacity-90"
            >
              Discover curated opportunities — track, apply, and succeed.
            </motion.p>

            {/* 🔥 Clickable Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <motion.div
                onClick={() => (window.location.href = "/jobs/my-applications")}
                className="cursor-pointer bg-white rounded-2xl p-4 shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] hover:bg-neutral-50"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="text-xs uppercase text-gray-500">Jobs Applied</div>
                <CountUp end={appliedCount} className="text-2xl font-bold text-blue-700" />
              </motion.div>

              <motion.div
                onClick={() => (window.location.href = "/jobs/updateprofile")}
                className="cursor-pointer bg-white rounded-2xl p-4 shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] hover:bg-neutral-50"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <div className="text-xs uppercase text-gray-500">Branch</div>
                <div className="text-2xl font-bold text-purple-600">{student?.branch}</div>
              </motion.div>

              <motion.div
                onClick={() => (window.location.href = "/jobs/updateprofile")}
                className="cursor-pointer bg-white rounded-2xl p-4 shadow-md border border-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.03] hover:bg-neutral-50"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs uppercase text-gray-500">Year</div>
                <div className="text-2xl font-bold text-green-600">{student?.year}</div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* ================= BODY ================= */}
        <main className="max-w-6xl mx-auto px-6 -mt-10">

          {/* Temp Message */}
          <AnimatePresence>
            {tempMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-6 p-3 bg-white rounded-xl border-l-4 border-blue-500 shadow"
              >
                {tempMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl mt-6 shadow border border-gray-100">
            <div className="flex gap-3 items-center w-full md:w-2/3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles, companies..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-300"
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-3 rounded-xl border border-gray-200"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-Time</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-Time</option>
                <option value="remote">Remote</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-3 rounded-xl border border-gray-200"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A → Z</option>
              </select>
            </div>
          </div>

          <div className="w-full bg-yellow-100 border border-yellow-300 text-yellow-800 text-center text-xs sm:text-sm px-4 py-2 rounded-xl shadow mb-6">
            All application data is securely recorded and reviewed only for placement purposes.
          </div>

          {/* ================= JOB CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <AnimatePresence>
              {filtered.map((job) => (
                <motion.article
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.28 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                >
                  {/* Bookmark */}
                  <button
                    onClick={() => toggleBookmark(job._id)}
                    className={`absolute top-4 right-4 text-lg ${
                      bookmarked.has(job._id) ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>

                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{job.name}</h3>

                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.description}</p>

                      <div className="mt-4 flex gap-2 flex-wrap text-xs">
                        {job.type && (
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                            {job.type}
                          </span>
                        )}
                        {job.location && (
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700">
                            {job.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Apply / Withdraw */}
                    <div className="w-32 flex-shrink-0 flex flex-col items-end gap-3">
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-semibold underline"
                      >
                        Company Site →
                      </a>

                      {appliedJobIds.has(job._id) ? (
                        <button
                          disabled={processingWithdrawId === job._id}
                          onClick={() => handleWithdraw(job._id)}
                          className="mt-2 w-full py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
                        >
                          {processingWithdrawId === job._id
                            ? "Withdrawing..."
                            : "Withdraw"}
                        </button>
                      ) : (
                        <button
                          disabled={processingApplyId === job._id}
                          onClick={() => openApplyModal(job)}
                          className="mt-2 w-full py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-60"
                        >
                          {processingApplyId === job._id
                            ? "Processing..."
                            : "I have Applied"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </main>

        {/* ================= APPLY MODAL ================= */}
        <AnimatePresence>
          {confirmOpen && jobToApply && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setConfirmOpen(false)}
              />

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative z-50 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-2">Confirm Application</h3>

                <p className="text-gray-700 mb-4">
                  You are about to confirm for <strong>{jobToApply.name}</strong>. This
                  will mark the job as applied in your dashboard.
                </p>

                <div className="mb-4">
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="text-lg font-semibold">{jobToApply.name}</div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmApply}
                    disabled={processingApplyId === jobToApply._id}
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold"
                  >
                    {processingApplyId === jobToApply._id
                      ? "Processing..."
                      : "Confirm & Apply"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
