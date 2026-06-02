export type Session = {
  id: number;
  name: string;
  status: string;
};

export type KeyInput = {
  backspace?: boolean;
  ctrl?: boolean;
  delete?: boolean;
  downArrow?: boolean;
  escape?: boolean;
  leftArrow?: boolean;
  return?: boolean;
  rightArrow?: boolean;
  tab?: boolean;
  upArrow?: boolean;
};

export type Viewport = {
  height: number;
  width: number;
};

export type Layout = {
  bodyHeight: number;
  headerHeight: number;
  paneBoxWidth: number;
  sidebarWidth: number;
  terminalCols: number;
  terminalRows: number;
  viewportHeight: number;
  viewportWidth: number;
};
