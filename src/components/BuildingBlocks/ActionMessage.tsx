export const getActionMessage = (action: string) => {
  if (action === "run") return "Running";
  if (action === "compile") return "Compiling";
  if (action === "test") return "Testing";
  return "Unknown action";
};
