import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/footer/Footer';

const termsHighlights = [
  {
    title: 'Code Ownership',
    text: 'You retain full ownership and intellectual property rights over any code buffers you create or upload onto Kodax.',
  },
  {
    title: 'Ephemeral Syncing',
    text: 'WebSocket message streams, cursor locations, and keystrokes are processed in-memory and discarded upon room closure.',
  },
  {
    title: 'Room Sharing',
    text: 'Distributing collaborative room links grants other users permission to view, edit, or delete your active session buffer.',
  },
];

const termsSections = [
  {
    title: '1. Scope of Service',
    body: 'Kodax provides real-time collaborative code editing interfaces, WebSocket synchronization engines, crew chat rooms, and repository integrations. We provide the tools for collaborative development, but the responsibility of maintaining stable backups and repository integrity remains with you.',
  },
  {
    title: '2. Account Registration',
    body: 'To initialize persistent workspaces, link repositories, or customize rooms, you must register using email credentials or OAuth integrations (such as GitHub or Google). You must keep your credentials secure and assume responsibility for all activities occurring under your account.',
  },
  {
    title: '3. Collaborative Rooms & Shared Links',
    body: 'When you generate a collaborative invite link, anyone with access to that link may view, edit, copy, or delete the active file buffer inside that session room. Kodax is not responsible for unauthorized code exposure or alterations resulting from shared URLs.',
  },
  {
    title: '4. Code Ownership & Intellectual Property',
    body: 'We do not claim any copyright, ownership, or intellectual property rights over your source code, configs, or assets. By sharing rooms, you grant co-collaborators inside the room a non-exclusive license to edit and modify your workspace buffers.',
  },
  {
    title: '5. Keystroke & Ephemeral Data Syncing',
    body: 'To synchronize multi-user keystrokes, active document state, and cursor vectors, Kodax processes stream data in temporary server memory. This synchronization data is transient and is discarded when all users disconnect and the session terminates.',
  },
  {
    title: '6. Acceptable Use Policy',
    body: 'You must use the workspaces for lawful purposes. You agree not to upload malicious scripts, reverse-engineer WebSocket signaling servers, overload system APIs, or share copyrighted code or material without proper authorization.',
  },
  {
    title: '7. Disclaimer & Limitation of Liability',
    body: 'KODAX IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE ARE NOT LIABLE FOR CODE CORRUPTION, BUFFER DESYNCHRONIZATION, DESYNC ERRORS, LOSS OF DATA, PLATFORM OUTAGES, OR ANY DIRECT OR INDIRECT DAMAGES ARISING FROM YOUR WORKSPACE.',
  },
  {
    title: '8. Modifications to Terms',
    body: 'We reserve the right to modify these Terms and Conditions at any time. Continued access or use of the collaborative editor interfaces constitutes your agreement to be bound by the updated terms.',
  },
];

const quickLinks = termsSections.map((section) => ({
  title: section.title,
  href: `#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
}));

const whatThisCovers = [
  'Workspace Sync & Ephemeral Streams',
  'Code Ownership & Collaborator Licenses',
  'Secure Registration & OAuth Tokens',
  'Limitation of Liability & Acceptable Use',
];

const TermsPage = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden font-body-base policy-override"
      style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,transparent_70%)] blur-3xl" />
        <div className="absolute top-48 right-0 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(0,119,181,0.12)_0%,rgba(0,119,181,0.02)_40%,transparent_72%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-88 w-88 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,transparent_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* ── Header ── */}
        <header className="max-w-7xl mx-auto px-6 pt-8 sm:pt-10">
          <div className="flex items-center justify-between gap-6 policy-card backdrop-blur-xl rounded-[28px] px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div>
              <p className="text-spacex-micro text-white/40 mb-2">Legal / Agreement</p>
              <h1 className="text-spacex-h1 text-3xl sm:text-4xl tracking-[0.08em]">Terms & Conditions</h1>
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

          {/* ── Two-column grid ── */}
          <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">

            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-6 h-full">

              {/* Sidebar card */}
              <aside className="space-y-6 policy-aside rounded-4xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_14px_50px_rgba(0,0,0,0.28)]">
                <div className="inline-flex items-center gap-3 rounded-full policy-tag px-4 py-2 backdrop-blur-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0077b5] shadow-[0_0_16px_rgba(0,119,181,0.55)]" />
                  <span className="text-spacex-micro text-white/70">Last Updated May 22, 2026</span>
                </div>

                <div className="space-y-4">
                  <p className="text-spacex-micro text-white/40">Terms Overview</p>
                  <h2 className="text-4xl sm:text-5xl lg:text-5xl font-bold uppercase tracking-[0.08em] leading-[1] text-white">
                    Agreement rules, workspace rights, and liability limits.
                  </h2>
                  <p className="text-white/65 text-base leading-8">
                    These terms govern your access and use of the Kodax real-time editor. By opening a room or joining a session, you agree to these rules.
                  </p>
                </div>

                <div className="grid gap-3">
                  {termsHighlights.map((item) => (
                    <article
                      key={item.title}
                      className="policy-card rounded-3xl p-5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                    >
                      <h3 className="text-spacex-nav text-white mb-2 tracking-[0.12em]">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-6 normal-case">{item.text}</p>
                    </article>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="policy-card rounded-3xl p-5 backdrop-blur-md">
                    <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">Quick Links</h3>
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

                  <div className="policy-card rounded-3xl p-5 backdrop-blur-md">
                    <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">Contact</h3>
                    <p className="text-white/70 leading-7 normal-case text-sm">
                      If you have any questions about these Terms, please contact us by opening an issue on our GitHub repository.
                    </p>
                  </div>
                </div>
              </aside>

              {/* Terms Scope - fills remaining space */}
              <div className="policy-card rounded-4xl p-7 sm:p-8 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.2)] flex-1 flex flex-col justify-center">
                <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">Terms Scope</h3>
                <div className="space-y-4 text-white/65 leading-8 normal-case text-sm sm:text-base">
                  <p>
                    These Terms and Conditions govern your access and use of all collaborative features on the Kodax workspace. This includes WebSocket sync rooms, ephemeral multi-user editing channels, real-time message stream boards, and associated API endpoints.
                  </p>
                  <p>
                    By using our platform, you acknowledge and agree to these terms, including memory syncing rules and collaborator permission scopes. External tools, localized docker setups, or private self-hosted setups not connected to our network environment are excluded.
                  </p>
                  <p>
                    For additional questions regarding these rules, please open an issue in the project repository.
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-4">

              {/* Grid for terms section cards */}
              <div className="grid gap-4 md:grid-cols-2">
                {termsSections.slice(0, 6).map((section) => {
                  const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <article
                      id={sectionId}
                      key={section.title}
                      className="policy-card rounded-[28px] p-6 sm:p-7 backdrop-blur-md transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
                    >
                      <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{section.title}</h3>
                      <p className="text-white/65 leading-8 normal-case">{section.body}</p>
                    </article>
                  );
                })}

                {/* Highlighted wide container card for the last two sections (7 & 8) */}
                <div className="policy-card-highlighted rounded-[28px] p-6 sm:p-8 md:col-span-2 backdrop-blur-md transition-all">
                  <div className="grid gap-6 md:grid-cols-2">
                    <article id={termsSections[6].title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                      <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{termsSections[6].title}</h3>
                      <p className="text-white/65 leading-8 normal-case">{termsSections[6].body}</p>
                    </article>
                    <article id={termsSections[7].title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                      <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">{termsSections[7].title}</h3>
                      <p className="text-white/65 leading-8 normal-case">{termsSections[7].body}</p>
                    </article>
                  </div>
                </div>
              </div>

              {/* What This Covers */}
              <div className="policy-card rounded-4xl p-6 sm:p-8 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.2)]">
                <h3 className="text-spacex-nav text-white mb-3 tracking-[0.12em]">What This Covers</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {whatThisCovers.map((item) => (
                    <div
                      key={item}
                      className="policy-card rounded-2xl px-4 py-4 text-white/70 text-sm leading-6 normal-case backdrop-blur-sm"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </main>

        <Footer />
      </div>
    </div>
  );
};

export default TermsPage;
