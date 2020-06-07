import { createContext, useContext } from "react";

export const HandlerContext = createContext({});

export const useHandler = () => useContext(HandlerContext);
