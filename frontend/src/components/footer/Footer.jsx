import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TermsModal from './TermsModal';

const Footer = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer className="w-full border-t border-[rgba(240,240,250,0.1)] py-8 mt-auto z-10 relative bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="text-spacex-nav text-white/50 tracking-[2px] text-center xl:text-left shrink-0">
          &copy; {new Date().getFullYear()} KODAX. ALL RIGHTS RESERVED.
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link to="/privacy-policy" className="text-spacex-nav text-white/50 hover:text-white transition-colors">PRIVACY POLICY</Link>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-spacex-nav text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              TERMS OF SERVICE
            </button>
            <a href="https://github.com/Varun2526/Real_time_collaborative_code-editor" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/50 hover:text-white transition-colors">GITHUB</a>
          </div>
          
          <div className="hidden md:block w-px h-4 bg-white/20"></div>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="text-spacex-micro text-white/70 hidden sm:inline mr-2">TEAM:</span>
            {[
              { name: 'VARUN', url: 'https://www.linkedin.com/in/varun-koppula-b01916315/' },
              { name: 'HAREESH', url: 'https://www.linkedin.com/in/venkata-hareesh-kaza-72b237330/' },
              { name: 'NIHAL', url: 'https://www.linkedin.com/in/nimishakavi-sri-nihal-723069271/' },
              { name: 'JAYARAM', url: 'https://www.linkedin.com/in/bollam-jayaram-aditya/' },
              { name: 'NIGAMA', url: 'https://www.linkedin.com/in/nigama-vydyula-8554a83b6/' },
            ].map((member) => (
              <a
                key={member.name}
                href={member.url}
                target="_blank"
                rel="noreferrer"
                className="text-spacex-nav text-white/50 hover:text-white transition-colors"
              >
                {member.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  );
};

export default Footer;
