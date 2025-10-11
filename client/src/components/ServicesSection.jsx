'use client';

import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Mail, Globe, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    title: "Website Development",
    icon: Globe,
    description:
      "I design and develop fully responsive, fast, and SEO-optimized websites using modern technologies like Next.js and Tailwind CSS. Each site is built with immense focus on detail, ensuring seamless user experience and performance.",
  },
  {
    title: "Consultancy",
    icon: Mail,
    description:
      "Get personalized digital consultancy on your online presence, website optimization, or project idea — your first session is absolutely free. If you purchase a website, consultancy remains free for future discussions too.",
  },
  {
    title: "Software Issue Fixing",
    icon: Wrench,
    description:
      "I troubleshoot and resolve software-related issues on laptops and computers, including system errors, slow performance, installation problems, and software conflicts. With years of experience, I provide precise, practical solutions to get your systems running smoothly.",
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate service cards
      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none', // prevents fade out
          },
        }
      );

      // Icon hover bounce effect
      gsap.utils.toArray('.service-icon').forEach((icon) => {
        icon.addEventListener('mouseenter', () => {
          gsap.to(icon, { scale: 1.2, rotate: 10, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        });
        icon.addEventListener('mouseleave', () => {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power1.inOut' });
        });
      });

      // CTA slide-up + fade
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="container mx-auto py-32 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary mb-4">
          My Services
        </h2>
        <p className="text-secondary max-w-2xl mx-auto text-base">
          Over the years, I’ve worked with immense focus, passion, and dedication
          to create digital solutions that truly help people — whether it’s a
          website, technical fix, or professional advice. Your first consultancy
          is always <span className="font-semibold text-primary">free</span>.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {servicesData.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="service-card group bg-white rounded-2xl p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-primary/10 flex flex-col items-center text-center"
            >
              <div className="mb-4 transition-transform duration-500 service-icon">
                <Icon className="w-12 h-12 text-primary " />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-secondary text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="mt-20 text-center">
        <h3 className="text-2xl font-semibold text-primary mb-4">
          Ready to book your free consultancy?
        </h3>
        <p className="text-secondary mb-8">
          I’m available on weekends (Saturday & Sunday). You can email me directly
          or book through the form below.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://forms.gle/QMTanH6ypPqNNNPc7"
            target="_blank"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary/90 transition-colors"
          >
            Book Appointment (Google Form)
          </Link>
          <Link
            href="mailto:abdulbarr@gmail.com?subject=Consultancy%20Booking%20Request&body=Hi%20Abdul%2C%0AI%20am%20interested%20in%20your%20services.%20Here%20are%20my%20details%3A%0A-%20Name%3A%20%0A-%20Service%3A%20%0A-%20Preferred%20Date%3A%20%0A-%20Message%3A%20%0A"
            className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
          >
            Email Me
          </Link>
        </div>
      </div>
    </section>
  );
}




export const metadata = {
  title: 'Services - Abdul Barr',
  description: 'Explore the services I provide including website development, consultancy, and software/laptop fixing. First consultancy free!',
};

