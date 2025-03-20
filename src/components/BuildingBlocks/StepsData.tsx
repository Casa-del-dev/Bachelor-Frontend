let stepsDataGlobal: any = null;
let changed: boolean = false;

export const setStepsData = (data: any) => {
  stepsDataGlobal = data;
};

export const getStepsData = () => {
  return stepsDataGlobal;
};

export const setChanged = (data: boolean) => {
  changed = data;
};

export const getChanged = () => {
  return changed;
};
