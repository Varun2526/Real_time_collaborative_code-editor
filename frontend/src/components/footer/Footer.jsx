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
            <Link to="/privacy-policy" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors">PRIVACY POLICY</Link>
            <button 
              onClick={() => setIsTermsOpen(true)}
              className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors cursor-pointer"
            >
              TERMS OF SERVICE
            </button>
            
            <a href="https://github.com/Varun2526/Real_time_collaborative_code-editor" target="_blank" rel="noreferrer" className="text-spacex-nav text-[#0077b5]/80 hover:text-[#0077b5] transition-colors">GITHUB</a>
            
            
          </div>
          
          <div className="hidden md:block w-px h-4 bg-white/20"></div>
          
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="text-spacex-micro text-white/70 hidden sm:inline mr-2">TEAM:</span>
            <a href="https://www.linkedin.com/in/varun-koppula-b01916315/" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors uppercase">VARUN</a>
            <a href="https://www.linkedin.com/in/venkata-hareesh-kaza-72b237330/" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors uppercase">HAREESH</a>
            <a href="https://www.linkedin.com/in/nimishakavi-sri-nihal-723069271/" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors uppercase">NIHAL</a>
            <a href="https://www.linkedin.com/in/bollam-jayaram-aditya/" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors uppercase">JAYARAM</a>
            <a href="https://www.linkedin.com/in/nigama-vydyula-8554a83b6/" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/40 hover:!text-[#0077b5] transition-colors uppercase">NIGAMA</a>
          </div>
        </div>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  );
};

export default Footer;
