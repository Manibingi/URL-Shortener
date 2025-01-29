import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const toggleCreateLink = () => setShowCreateForm((prev) => !prev);

  return (
    <AppContext.Provider
      value={{ showCreateForm, toggleCreateLink, setShowCreateForm }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
