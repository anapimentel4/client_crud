// PerfilesContext.js
import { createContext, useContext, useState } from 'react';

const PerfilesContext = createContext();

export const PerfilesProvider = ({ children }) => {
  const [perfiles, setPerfiles] = useState([]);

  return (
    <PerfilesContext.Provider value={{ perfiles, setPerfiles }}>
      {children}
    </PerfilesContext.Provider>
  );
};

export const usePerfiles = () => {
  return useContext(PerfilesContext);
};

