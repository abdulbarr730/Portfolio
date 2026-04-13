'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { scroller } from "react-scroll";
import { usePathname, useRouter } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const year = new Date().getFullYear();

  const contactEmail = "hello@abdulbarr.in";

  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollToSection = (id) => {
    if (pathname !== '/') {
      router.push('/');
      setTimeout(() => {
        scroller.scrollTo(id, {
          duration: 800,
          smooth: "easeInOutQuart",
          offset: -60
        });
      }, 200);
    } else {
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
        offset: -60
      });
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: subscriberEmail }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setMessage("You're subscribed 🎉");
        setSubscriberEmail("");
      } else {
        setStatus("error");
        setMessage(data.message);
      }

    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.footer
      className="bg-background text-secondary py-16 border-t border-muted relative z-40"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Abdul Barr
            </h1>
            <p className="text-sm mt-2">
              Full Stack Developer & ML Enthusiast building scalable digital products.
            </p>

            <motion.a
              href={`mailto:${contactEmail}`}
              className="inline-block mt-4 font-semibold text-primary underline hover:opacity-80"
              whileHover={{ scale: 1.05 }}
            >
              {contactEmail}
            </motion.a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-primary mb-4">
              Navigation
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => scrollToSection("about")} className="hover:text-primary">
                  About
                </button>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-primary mb-4">
              Services
            </h3>

            <ul className="space-y-2 text-sm">
              {[
                "Full Stack Development",
                "AI Integration",
                "Website Optimisation",
                "Consulting"
              ].map((service) => (
                <li key={service}>
                  <Link 
                    href="/services"
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    {service}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-primary mb-4">
              Newsletter
            </h3>

            <p className="text-sm mb-4">
              Get notified when I publish new blogs & projects.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md border border-muted bg-transparent"
                required
              />

              <button
                disabled={loading}
                className="bg-primary text-white py-2 rounded-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>

              {status && (
                <p
                  className={`text-sm ${
                    status === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>

        </div>

        <div className="border-t border-muted pt-6 flex flex-col md:flex-row justify-between items-center text-sm">

          <p>
            © {year} Abdul Barr. All Rights Reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>

            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>

        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;