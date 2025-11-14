"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
    course: "",
    branch: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/student/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/jobs/login");
    } else {
      setMessage(data.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-6">Student Registration</h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-md"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            type="text"
            placeholder="Roll Number"
            className="w-full p-3 border rounded-md"
            value={form.rollNumber}
            onChange={(e) =>
              setForm({ ...form, rollNumber: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Course (e.g., B.Tech)"
            className="w-full p-3 border rounded-md"
            value={form.course}
            onChange={(e) =>
              setForm({ ...form, course: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Branch (e.g., CSE)"
            className="w-full p-3 border rounded-md"
            value={form.branch}
            onChange={(e) =>
              setForm({ ...form, branch: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Year (e.g., 3)"
            className="w-full p-3 border rounded-md"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />

        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 mt-6"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {message && (
          <div className="mt-4 p-3 bg-red-500 text-white text-center rounded">
            {message}
          </div>
        )}

        <p className="text-center mt-5 text-gray-700">
          Already have an account?{" "}
          <Link href="/jobs/login" className="text-blue-600 underline">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
