import React from 'react';

const DonationButtons: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center p-3">
      <a href="https://www.buymeacoffee.com/alvarocavalcanti" target="_blank" rel="noreferrer">
        <img
          src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          alt="Buy Me A Coffee"
          className="h-9 inline-block"
        />
      </a>
      <a href="https://ko-fi.com/O4O1WSP5B" target="_blank" rel="noreferrer">
        <img
          src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
          alt="Buy Me a Coffee at ko-fi.com"
          className="h-9 inline-block"
        />
      </a>
    </div>
  );
};

export default DonationButtons;
