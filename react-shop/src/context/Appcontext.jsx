import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [carts, setCarts] = useState([]);
  const [userDetail, setUserDetail] = useState({});

  return (
    <AppContext.Provider value={{ carts, setCarts, userDetail, setUserDetail }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);