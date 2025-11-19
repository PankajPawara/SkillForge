import { Card } from '@/components/ui/card'
import React from 'react'

const About = () => {
    return (
        <div className="mt-10 mb-10 mx-auto max-w-7xl flex flex-col gap-5">
            {/* Page Heading */}
            <div className="flex flex-col">
                <div className="w-full space-y-2">
                    <h1 className="font-bold text-3xl mx-auto">About SkillForge</h1>
                    {/* Intro Card */}
                    <Card className="mx-auto p-5 flex flex-col gap-2">
                        <p className="text-xl">
                            <b>SkillForge</b> is a modern and full-featured Learning Management System (LMS) built to support
                            the evolving needs of online education. It empowers educators to create and manage interactive courses,
                            while providing students with an intuitive platform to enroll, learn, and track their progress all in one place.
                            <br /><br />
                            Built with a focus on simplicity, scalability, and performance, SkillForge also offers administrators full control
                            over platform content, user roles, and analytics.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Technology Stack */}
            <div>
                <h2 className="font-bold text-3xl">Technology Stack</h2>
                <Card className="p-5 mt-2">
                    <ul className="list-disc list-inside text-lg space-y-1">
                        <li><b>Frontend:</b> React.js, Tailwind CSS, ShadCN UI, Redux Toolkit</li>
                        <li><b>Backend:</b> Node.js, Express.js</li>
                        <li><b>Database:</b> MongoDB (Mongoose)</li>
                        <li><b>Media Storage:</b> Cloudinary</li>
                        <li><b>Payments:</b> Stripe</li>
                        <li><b>Authentication:</b> JWT with cookie sessions</li>
                        <li><b>Dev Tools:</b> Vite, Thunder Client, GitHub</li>
                    </ul>
                </Card>
            </div>

            {/* Key Features */}
            <div>
                <h2 className="font-bold text-3xl">Key Features</h2>
                <Card className="p-5 mt-2">
                    <ul className="list-disc list-inside text-lg space-y-1">
                        <li>Role-based access: Student, Trainer, and Admin</li>
                        <li>Course creation, editing, and publishing controls</li>
                        <li>Lecture uploads with Cloudinary video hosting</li>
                        <li>Secure Stripe payment integration</li>
                        <li>Admin analytics dashboard with revenue tracking</li>
                        <li>Student progress tracking and course access</li>
                        <li>Dynamic UI with RTK Query</li>
                    </ul>
                </Card>
            </div>

            {/* Meet the Developer */}
            <div>
                <h2 className="font-bold text-3xl">Meet the Developer</h2>
                <Card className="p-5 mt-2 text-lg">
                    <p>
                        👋 Hi, we&apos;re <b>Pankaj Pawara, Faizaan Ansari, Sahil Mansuri and Pushkar Deore</b>, the creators of SkillForge.
                        We are passionate Full Stack Developers dedicated to building practical and scalable web applications.
                        This project showcases our expertise in authentication, payment integration, cloud storage, and admin-level controls.
                    </p>
                </Card>
            </div>

            {/* Future Enhancements */}
            <div>
                <h2 className="font-bold text-3xl">Planned Future Enhancements</h2>
                <Card className="p-5 mt-2">
                    <ul className="list-disc list-inside text-lg space-y-1">
                        <li>Course categorization and filtering</li>
                        <li>Interactive Q&A / Comments section</li>
                        <li>Badge and certification system</li>
                        <li>Mobile responsiveness and PWA</li>
                        <li>Email notifications for activity updates</li>
                    </ul>
                </Card>
            </div>
        </div>
    )
}

export default About
