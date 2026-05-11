import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-[rgba(240,240,250,0.1)] py-8 mt-auto z-10 relative bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-spacex-nav text-white/50 tracking-[2px]">
          &copy; {new Date().getFullYear()} KODAX. ALL RIGHTS RESERVED.
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-spacex-nav text-white/50 hover:text-white transition-colors">PRIVACY POLICY</a>
          <a href="#" className="text-spacex-nav text-white/50 hover:text-white transition-colors">TERMS OF SERVICE</a>
          <a href="https://github.com/Varun2526" target="_blank" rel="noreferrer" className="text-spacex-nav text-white/50 hover:text-white transition-colors">GITHUB</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
