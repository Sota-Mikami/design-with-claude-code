export type ScreenState = {
  id: string;
  label: string;
  query?: string;
};

export type ScreenVariant = {
  id: string;
  label: string;
  query: string;
};

export type ScreenPattern = {
  id: string;
  label: string;
  description: string;
  query: string;
  group?: string;
};

export type Screen = {
  id: string;
  label: string;
  path: string;
  states: ScreenState[];
  variants?: ScreenVariant[];
  patterns?: ScreenPattern[];
  linksTo?: string[];
};

// Define your screens here.
//
// Only include screens that are part of the prototype's user flow.
// Do NOT include /spec, /qa, /map -- these are meta pages, not prototype screens.
//
// - states: different modes of the same screen (e.g. tabs)
//   -> use `query: "_tab=xxx"` to switch via query param
//
// - variants: data-condition variations (e.g. empty, loading, error)
//   -> use `query: "_v=xxx"` to switch
//
// - patterns: design alternatives (e.g. layout A vs B)
//   -> use `query: "_p=xxx"` to switch
//   -> IMPORTANT: include the default/baseline pattern too, so all options
//     are visible side-by-side in the Map panel for comparison.
//
// - linksTo: IDs of screens this screen navigates to (for map arrows)

export const screens: Screen[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    states: [{ id: "default", label: "Default" }],
    // variants: [],
    // patterns: [],
    // linksTo: [],
  },
];
