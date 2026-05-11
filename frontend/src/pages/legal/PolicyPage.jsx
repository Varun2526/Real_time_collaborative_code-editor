import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/Footer';

const policyHighlights = [
  {
    title: 'What We Collect',
    text: 'Account details, room activity, and limited technical data needed to keep collaborative sessions stable and secure.',
  },
  {
    title: 'How We Use It',
    text: 'To authenticate users, run live editor features, improve reliability, and support room-level collaboration.',
  },
  {
    title: 'Your Controls',
    text: 'You can manage your account, leave rooms, and contact us to request access, correction, or deletion where applicable.',
  },
];

const policySections = [
  {
    title: '1. Overview',
    body:
      'This Privacy Policy explains how Kodax collects, uses, stores, and protects information when you use the platform. By using the service, you agree to the practices described on this page.',
  },
  {
    title: '2. Information We Collect',
    body:
      'We may collect account identifiers, profile information, room metadata, collaboration activity, messages shared inside rooms, and basic device or browser information used for security and diagnostics.',
  },
  {
    title: '3. How We Use Information',
    body:
      'Information is used to create and manage accounts, enable real-time collaboration, authenticate sessions, prevent abuse, troubleshoot errors, and improve the overall product experience.',
  },
  {
    title: '4. Collaboration Data',
    body:
      'When you join a room, your participation, messages, and editor activity may be visible to other room members according to the room settings and access level chosen by the room owner or host.',
  },
  {
    title: '5. Cookies and Session Data',
    body:
      'We use cookies and similar technologies where needed to keep you signed in, preserve preferences, and maintain secure sessions. You can control cookies through your browser settings, though some features may not work correctly if they are disabled.',
  },
  {
    title: '6. Data Sharing',
    body:
      'We do not sell personal information. We may share limited data with trusted service providers that help us operate the platform, or when required to comply with law, enforce policies, or protect users and the service.',
  },
  {
    title: '7. Data Retention',
    body:
      'We retain information only for as long as necessary to provide the service, fulfill legal obligations, resolve disputes, and maintain security. When data is no longer required, we take reasonable steps to delete or anonymize it.',
  },
  {
    title: '8. Security',
    body:
      'We use administrative, technical, and organizational safeguards designed to protect the platform and its data. No internet-based system can be guaranteed to be completely secure, so we continually work to reduce risk.',
  },
  {
    title: '9. Your Rights',
    body:
      'Depending on your location, you may have rights to access, correct, delete, or restrict certain personal information. You can contact us to make a privacy request and we will respond in accordance with applicable law.',
  },
  {
    title: '10. Changes to This Policy',
    body:
      'We may update this policy from time to time to reflect product, legal, or operational changes. Material updates will be reflected on this page with a revised effective date.',
  },
];

const quickLinks = policySections.map((section) => ({
  title: section.title,
  href: `#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
}));

const leftColumnSections = policySections.filter((_, index) => index % 2 === 0);
const rightColumnSections = policySections.filter((_, index) => index % 2 === 1);

const PolicyPage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-body-base">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,transparent_70%)] blur-3xl" />
        <div className="absolute top-48 right-0 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(0,119,181,0.12)_0%,rgba(0,119,181,0.02)_40%,transparent_72%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-88 w-88 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <header className="max-w-7xl mx-auto px-6 pt-8 sm:pt-10">
          <div className="flex items-center justify-between gap-6 border border-white/10 bg-white/3 backdrop-blur-xl rounded-[28px] px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div>
              <p className="text-spacex-micro text-white/40 mb-2">Legal / Privacy</p>
              <h1 className="text-spacex-h1 text-3xl sm:text-4xl tracking-[0.08em]">Privacy Policy</h1>
            </div>
            <Link
              to="/"
              className="btn-ghost whitespace-nowrap hover:scale-[1.02] transform transition-transform"
            >
              Back to Kodax
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 pb-16 pt-10 sm:pt-14">
          <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] items-start">
            <aside className="lg:sticky lg:top-8 space-y-6 rounded-4xl border border-white/10 bg-linear-to-br from-white/8 to-transparent p-6 sm:p-8 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.28)]">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/4 px-4 py-2 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0077b5] shadow-[0_0_16px_rgba(0,119,181,0.55)]" />
                <span className="text-spacex-micro text-white/70">Effective May 11, 2026</span>
              </div>

              <div className="space-y-5">
                <p className="text-spacex-micro text-white/40">Policy Overview</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-[0.08em] leading-[0.95] text-white">
                  Designed for trust, built for real-time collaboration.
                </h2>
                <p className="text-white/65 text-base sm:text-lg leading-8">
                  Kodax is built to help people collaborate in shared coding rooms. This policy explains what we collect,
                  why we collect it, and how we protect it.
                </p>
              </div>

              <div className="grid gap-4">
                {policyHighlights.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                  >
                    <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-6 normal-case">{item.text}</p>
                  </article>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-spacex-micro text-white/40 mb-3">Quick Links</p>
                <div className="grid gap-2">
                  {quickLinks.slice(0, 5).map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="text-sm text-white/65 hover:text-white transition-colors leading-6"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-5">
                <p className="text-spacex-micro text-white/40 mb-2">Contact</p>
                <p className="text-white/70 leading-7 normal-case">
                  For privacy questions, reach out through the project GitHub repository or the team contacts listed in the site footer.
                </p>
              </div>
            </aside>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-4">
                {leftColumnSections.map((section) => {
                  const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                  return (
                    <article
                      id={sectionId}
                      key={section.title}
                      className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-7 backdrop-blur-md transition-colors hover:border-white/20"
                    >
                      <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{section.title}</h3>
                      <p className="text-white/65 leading-8 normal-case">{section.body}</p>
                    </article>
                  );
                })}
              </div>

              <div className="space-y-4 lg:pt-16 xl:pt-0">
                {rightColumnSections.map((section) => {
                  const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                  return (
                    <article
                      id={sectionId}
                      key={section.title}
                      className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 sm:p-7 backdrop-blur-md transition-colors hover:border-white/20"
                    >
                      <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{section.title}</h3>
                      <p className="text-white/65 leading-8 normal-case">{section.body}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-start">
            <div className="rounded-4xl border border-white/10 bg-white/2.5 p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
              <p className="text-spacex-micro text-white/40 mb-3">Policy Scope</p>
              <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-[0.08em] mb-4">Clear and readable</h3>
              <p className="text-white/65 leading-8 normal-case">
                This page is intentionally structured like a professional legal document: a concise summary up top,
                followed by detailed sections, so users can quickly understand the essentials without digging through dense formatting.
              </p>
            </div>

            <div className="rounded-4xl border border-white/10 bg-white/3 p-6 sm:p-8 shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
              <p className="text-spacex-micro text-white/40 mb-4">What This Covers</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Account data and authentication',
                  'Room activity and collaboration history',
                  'Session cookies and preference storage',
                  'Security, retention, and user rights',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PolicyPage;