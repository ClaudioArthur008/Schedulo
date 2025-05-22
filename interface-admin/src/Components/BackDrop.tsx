import React from 'react';

interface BackDropProps {
  showBackDrop: boolean;
}

const BackDrop: React.FC<BackDropProps> = ({ showBackDrop }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full bg-black/40 backdrop-blur-sm z-20 transition-opacity duration-200 ease-in-out ${
        showBackDrop ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    />
  );
};

export default BackDrop;