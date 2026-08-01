import React, { createContext, useContext } from 'react';
export const SeniorModeContext = createContext();
export const useSenior = () => useContext(SeniorModeContext);