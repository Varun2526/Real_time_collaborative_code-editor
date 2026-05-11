import React from 'react';

const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 pt-24 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-black border border-[rgba(240,240,250,0.2)] p-8 max-w-2xl w-full max-h-[70vh] overflow-hidden flex flex-col rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 material-symbols-outlined text-white/50 hover:text-white transition-colors"
        >
          close
        </button>

        <h2 className="text-spacex-hero text-3xl mb-2 font-bold tracking-[2px] text-center">TERMS OF SERVICE</h2>
        <p className="text-spacex-micro text-white/40 mb-8 font-bold text-center">LAST UPDATED: MAY 11, 2026</p>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8 pb-6">
          <p className="text-spacex-body text-white/80 leading-relaxed text-sm">
            Welcome to the Real-Time Code Editor Platform ("Platform", "Service", "we", "our", or "us"). These Terms of Service ("Terms") govern your access to and use of the Platform, including all collaborative coding, chat, room creation, and related services.
          </p>
          <p className="text-spacex-body text-white/80 leading-relaxed text-sm">
            By creating an account, accessing, or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Service.
          </p>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">1. Eligibility</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>You must be at least 13 years old to use this Service. By using the Platform, you confirm that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are legally capable of entering into a binding agreement.</li>
                <li>The information you provide is accurate and current.</li>
                <li>Your use of the Service complies with all applicable laws and regulations.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">2. User Accounts</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>To access certain features, you may need to create an account. You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maintaining the confidentiality of your account credentials.</li>
                <li>All activities performed under your account.</li>
                <li>Ensuring your account information remains accurate.</li>
              </ul>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Share your login credentials.</li>
                <li>Impersonate another person or entity.</li>
                <li>Create accounts using false or misleading information.</li>
              </ul>
              <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">3. Platform Features</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>The Platform may provide features including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Real-time collaborative code editing</li>
                <li>Chat and messaging</li>
                <li>Room creation and sharing</li>
                <li>File storage and synchronization</li>
                <li>Authentication through email or third-party providers</li>
                <li>Code execution or preview functionality</li>
              </ul>
              <p>Features may change, be removed, or updated at any time without prior notice.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">4. Acceptable Use Policy</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-1">
              <p>You agree to use the Platform responsibly and lawfully. You must NOT:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Upload or distribute malicious software, viruses, or harmful code.</li>
                <li>Attempt unauthorized access to servers, databases, or accounts.</li>
                <li>Use the Platform for illegal activities.</li>
                <li>Harass, abuse, threaten, or harm other users.</li>
                <li>Share content that is hateful, discriminatory, obscene, or unlawful.</li>
                <li>Interfere with the normal functioning of the Platform.</li>
                <li>Use automated systems to abuse or overload the Service.</li>
                <li>Upload copyrighted material without proper authorization.</li>
              </ul>
              <p className="pt-2 italic">Violation of this policy may result in immediate suspension or permanent termination.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">5. User Content</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>Users may create, upload, store, or share content including code, text, files, and messages ("User Content"). You retain ownership of your User Content.</p>
              <p>However, by using the Service, you grant us a limited, non-exclusive, worldwide license to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Store and process your content.</li>
                <li>Display your content to authorized collaborators.</li>
                <li>Operate and improve the Platform.</li>
              </ul>
              <p>You are solely responsible for the content you upload or share. We are not responsible for: Loss of uploaded content, unauthorized sharing caused by public room links, or user-generated code vulnerabilities or damages.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">6. Collaborative Rooms and Sharing</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>The Platform may allow users to create public or private collaboration rooms. When sharing room links:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You are responsible for controlling access.</li>
                <li>Anyone with access may view or edit shared content depending on permissions.</li>
                <li>We are not liable for data exposure caused by shared links.</li>
              </ul>
              <p>We may remove rooms or content that violate these Terms.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">7. Third-Party Authentication</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              The Platform may support login using third-party providers such as Google or GitHub. By using third-party authentication, you authorize us to access basic profile information permitted by the provider. Your use of those services remains subject to their respective terms and privacy policies. We are not responsible for third-party service outages or policy changes.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">8. Privacy</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              Your use of the Platform is also governed by our Privacy Policy. The Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">9. Intellectual Property</h3>
            <div className="text-spacex-body text-white/60 text-[13px] leading-relaxed space-y-2">
              <p>All Platform software, branding, logos, UI designs, and non-user-generated content are owned by us or our licensors. You may not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Copy or redistribute Platform source code without authorization.</li>
                <li>Reverse engineer or attempt to exploit the Service.</li>
                <li>Use our branding without permission.</li>
              </ul>
              <p>Open-source components used within the Platform remain subject to their original licenses.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">10. Service Availability</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              We strive to provide reliable access but do not guarantee uninterrupted availability. The Platform may experience maintenance downtime, network interruptions, security incidents, or feature modifications. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">11. Security</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              While we implement reasonable security measures, no online service can guarantee complete security. You are responsible for protecting your credentials, avoiding suspicious links or files, and maintaining backups of important work. You agree not to intentionally exploit security vulnerabilities.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">12. Termination</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              We may suspend or terminate access to the Platform if you violate these Terms, if your activity poses security or legal risks, or if required by law. You may stop using the Service at any time. Upon termination, access to rooms and content may be revoked, and stored content may be deleted after a reasonable retention period.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">13. Disclaimer of Warranties</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              The Platform is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties regarding reliability, availability, accuracy, security, or fitness for a particular purpose. We do not guarantee that the Platform will be error-free or uninterrupted.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">14. Limitation of Liability</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for indirect or consequential damages, data loss, lost profits, business interruption, security breaches caused by third parties, or user-generated content or code. Your use of the Platform is at your own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">15. Indemnification</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              You agree to indemnify and hold harmless the Platform owners, developers, and affiliates from claims, damages, liabilities, or expenses arising from your misuse of the Service, your violation of these Terms, your uploaded content, or your infringement of third-party rights.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">16. Governing Law</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              These Terms shall be governed by and interpreted in accordance with the laws applicable in your operating jurisdiction, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">17. Changes to These Terms</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              We may update these Terms from time to time. Updated versions will be posted with a revised "Last Updated" date. Continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">18. Contact Information</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              For questions or concerns regarding these Terms, you may contact the Platform administrators or development team through the official support channels provided within the application.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-white font-bold tracking-widest text-xs uppercase border-l-2 border-white/30 pl-4">19. Entire Agreement</h3>
            <p className="text-spacex-body text-white/60 text-[13px] leading-relaxed">
              These Terms constitute the entire agreement between you and the Platform regarding use of the Service and supersede any prior agreements or understandings.
            </p>
          </section>
          
          <div className="pt-8 border-t border-white/10">
            <p className="text-spacex-body text-white/80 font-bold uppercase text-[13px]">
              By using the Platform, you acknowledge that you have read, understood, and agreed to these Terms of Service.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="btn-ghost !py-2.5 !px-8 hover:scale-105 transform transition-all duration-300"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
