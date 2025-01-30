import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleCreateLink = () => setShowCreateForm((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        showCreateForm,
        toggleCreateLink,
        setShowCreateForm,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
