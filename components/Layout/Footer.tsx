
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-center py-4 mt-auto">
      <p className="text-sm text-gray-400">
        &copy; {new Date().getFullYear()} FITAI. Todos os direitos reservados.
      </p>
    </footer>
  );
};
    