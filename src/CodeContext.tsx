import { createContext, useContext, useState, ReactNode } from "react";

interface CodeContextType {
  code: string;
  setCode: (code: string) => void;
  codeOutput: string;
  setCodeOutput: (output: string) => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export function CodeProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");

  return (
    <CodeContext.Provider value={{ code, setCode, codeOutput, setCodeOutput }}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCodeContext() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
}
