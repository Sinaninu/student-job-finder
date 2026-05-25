import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  const features = [
    {
      title: 'Student Profiles',
      text: 'Students can create profiles, add skills, and upload their CV to prepare for applications.',
    },
    {
      title: 'Job Search',
      text: 'Students can browse jobs, filter opportunities, view details, and save interesting listings.',
    },
    {
      title: 'Applications',
      text: 'Students can apply for jobs and track their applications from their own dashboard.',
    },
    {
      title: 'Company Tools',
      text: 'Companies can create job posts, manage listings, and review student applications.',
    },
    {
      title: 'Admin Overview',
      text: 'Admins can monitor users, jobs, applications, and platform statistics.',
    },
    {
      title: 'Responsive Design',
      text: 'The platform is designed to work across desktop, tablet, and mobile screens.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create an account',
      text: 'Students and companies register with different roles so the platform can show the right tools.',
    },
    {
      number: '02',
      title: 'Build a profile or post jobs',
      text: 'Students complete their profile and upload a CV, while companies publish job opportunities.',
    },
    {
      number: '03',
      title: 'Apply and manage progress',
      text: 'Students apply for jobs and companies review applications through connected dashboards.',
    },
  ]

  const team = [
    {
      name: 'Ayisha Omer',
      role: 'Backend development, jobs, and applications',
    },
    {
      name: 'Sina Estifanos',
      role: 'Frontend Admin Dashboard, Integration, Authentication Testing & Deployment',
    },
    {
      name: 'Sadia Omer',
      role: 'Frontend development and UI design',
    },
  ]

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="eyebrow">Student Job Finder</p>

          <h1>Connecting students with meaningful job opportunities.</h1>

          <p>
            Student Job Finder is a fullstack web application designed to connect
            students with job opportunities and help companies manage student
            applications in one organized platform.
          </p>

          <div className="about-actions">
            <Link className="btn-primary" to="/jobs">
              Browse Jobs
            </Link>

            <Link className="btn-outline" to="/register">
              Create Account
            </Link>
          </div>
        </div>

        <div className="about-hero-card">
          <h3>Platform goal</h3>

          <p>
            Our goal is to make the job search process easier, clearer, and more
            accessible for students starting their career journey.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <p className="eyebrow">Purpose</p>

          <h2>Why we built this platform</h2>

          <p>
            The platform was created to make the job search process easier for
            students and more organized for companies. Students can explore jobs,
            manage their applications, and save opportunities, while companies can
            post jobs and review applicants through role-based dashboards.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <p className="eyebrow">Features</p>

          <h2>What the system includes</h2>
        </div>

        <div className="about-feature-grid">
          {features.map((feature) => (
            <article className="about-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <p className="eyebrow">Process</p>

          <h2>How it works</h2>
        </div>

        <div className="about-steps">
          {steps.map((step) => (
            <article className="about-step-card" key={step.number}>
              <span>{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section">
        <div className="section-heading">
          <p className="eyebrow">Team</p>

          <h2>Project team</h2>

          <p>
            Meet the developers behind Student Job Finder and their contribution
            areas.
          </p>
        </div>

        <div className="about-team-grid">
          {team.map((member) => (
            <article className="about-team-card" key={member.name}>
              <div className="team-avatar">
                {member.name.charAt(0)}
              </div>

              <h3>{member.name}</h3>

              <p>{member.role}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to explore student opportunities?</h2>

        <p>
          Start browsing available jobs or create an account to use the full
          platform.
        </p>

        <div className="about-actions">
          <Link className="btn-primary" to="/jobs">
            Explore Jobs
          </Link>

          <Link className="btn-outline" to="/register">
            Join Platform
          </Link>
        </div>
      </section>
    </main>
  )
}