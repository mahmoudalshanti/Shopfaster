import { createContext, useContext, useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import { PaletteMode, ThemeOptions } from "@mui/material";

type ShadeLevels = {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type ThemeColors = {
  grey: ShadeLevels;
  primary: ShadeLevels;
  green: ShadeLevels;
};

export const tokens: (mode: PaletteMode) => ThemeColors = (
  mode: PaletteMode
): ThemeColors => ({
  ...(mode === "dark"
    ? {
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        primary: {
          100: "#d0d1d5",
          200: "#a1a4ab",
          300: "#727681",
          400: "#1F2A40",
          500: "#141b2d",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
        green: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
      }
    : {
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        primary: {
          100: "#1f2a40",
          200: "#080b12",
          300: "#0c101b",
          400: "#f2f0f0",
          500: "#141b2d",
          600: "#1F2A40",
          700: "#727681",
          800: "#a1a4ab",
          900: "#d0d1d5",
        },
        green: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
      }),
});

export const themeSettings: (mode: PaletteMode) => ThemeOptions = (
  mode: PaletteMode
): ThemeOptions => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: { main: colors.primary[500] },
            secondary: { main: colors.green[700] },
            info: { main: colors.green[600] },
            background: { default: colors.primary[500] },
          }
        : {
            primary: { main: colors.primary[100] },
            secondary: { main: colors.green[200] },
            info: { main: colors.green[300] },
            background: { default: "#ddd" },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 13,
    },
    components: {
      MuiBadge: {
        styleOverrides: {
          badge: {
            height: "17px",
            minWidth: "17px",
            borderRadius: "50%",
            fontSize: "0.65rem",
            color: "white",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: 0,
            height: "35px",
            width: "35px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: 2,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            flex: 1,
            textTransform: "none",
            margin: "0 8px",
            backgroundColor:
              theme.palette.mode === "dark" ? "#004d40" : "#c8e6c9",
            color: theme.palette.mode === "dark" ? "#80cbc4" : "#388e3c",
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "12px",
            borderRadius: "8px",

            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.green[700]
                  : colors.green[200],
            },
            "&.Mui-selected": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.green[700]
                  : colors.green[200],
              color: "#ffffff",
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? colors.green[600]
                    : colors.green[300],
                color: "#ffffff",
              },
            },
          }),
        },
      },
    },
  };
};

type ColorModeContextType = {
  toggleColorMode: () => void;
};

// Create context for color mode
export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  useEffect(() => {
    const storage = window.localStorage.getItem("mode");
    if (storage) setMode(storage as PaletteMode);
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      window.localStorage.setItem(
        "mode",
        prevMode === "light" ? "dark" : "light"
      );
      return prevMode === "light" ? "dark" : "light";
    });
  };

  const theme = createTheme(themeSettings(mode));

  return {
    theme,
    toggleColorMode,
  };
};

export const useColorMode = (): ColorModeContextType => {
  return useContext(ColorModeContext);
};
