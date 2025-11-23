import { Card } from "@/components/ui/card";
import React from "react";

const About = () => {
  return (
    <div className="mt-10 mb-16 mx-auto max-w-7xl px-4 flex flex-col gap-10">

      {/* Page Heading */}
      <div className="text-center">
        <h1 className="font-bold text-3xl md:text-4xl">About SkillForge</h1>
      </div>

      {/* Intro */}
      <Card className="p-6 md:p-8 bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition rounded-xl">
        <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
          <b>SkillForge</b> is a powerful and modern Learning Management System (LMS)
          designed to support the dynamic needs of online education. It enables
          educators to create and manage interactive courses while providing
          students with a smooth, intuitive learning experience.

          <br /><br />

          Built with scalability, performance, and simplicity in mind, SkillForge
          gives administrators full control over platform content, user roles,
          payments, and analytics.
        </p>
      </Card>

      {/* Technology Stack */}
      <section>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Technology Stack</h2>
        <Card className="p-6 md:p-7 bg-white dark:bg-gray-700 shadow-sm rounded-xl">
          <ul className="list-disc list-inside text-lg space-y-2">
            <li><b>Frontend:</b> React.js, Tailwind CSS, ShadCN UI, Redux Toolkit</li>
            <li><b>Backend:</b> Node.js, Express.js</li>
            <li><b>Database:</b> MongoDB (Mongoose)</li>
            <li><b>Media Storage:</b> Cloudinary</li>
            <li><b>Payments:</b> Stripe</li>
            <li><b>Authentication:</b> JWT + Cookies</li>
            <li><b>Dev Tools:</b> Vite, Thunder Client, GitHub</li>
          </ul>
        </Card>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Key Features</h2>
        <Card className="p-6 md:p-7 bg-white dark:bg-gray-700 shadow-sm rounded-xl">
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Role-based access: Student, Trainer, and Admin</li>
            <li>Course creation, editing, and publishing</li>
            <li>Lecture uploads with Cloudinary video hosting</li>
            <li>Secure Stripe payment integration</li>
            <li>Admin dashboard with revenue analytics</li>
            <li>Student course progress tracking</li>
            <li>Dynamic UI with RTK Query</li>
          </ul>
        </Card>
      </section>

      {/* Meet the Developer */}
      <section>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Meet the Developer</h2>
        <Card className="p-6 md:p-7 bg-white dark:bg-gray-700 shadow-sm rounded-xl text-lg leading-relaxed">
          <p>
            👋 Hi, we are <b>Pankaj Pawara, Faizaan Ansari, Sahil Mansuri, and Pushkar Deore</b> —
            passionate Full Stack Developers dedicated to building scalable and
            meaningful digital solutions.
            <br /><br />
            SkillForge reflects our collective expertise in authentication,
            payment processing, cloud storage, admin system design, and full-stack
            application development.
          </p>
        </Card>
      </section>

      {/* Future Enhancements */}
      <section>
        <h2 className="font-bold text-2xl md:text-3xl mb-3">Planned Future Enhancements</h2>
            
        <Card className="p-6 md:p-7 bg-white dark:bg-gray-700 shadow-sm rounded-xl">
          <ul className="list-disc list-inside text-lg space-y-2">
            <li>Advanced course categorization & filtering</li>
            <li>Interactive Q&A and discussion section</li>
            <li>Achievement badges & certification</li>
            <li>Full mobile responsiveness + PWA support</li>
            <li>Email notifications for user activity</li>
          </ul>
        </Card>
      </section>

    </div>
  );
};

export default About;
