import { createMuiTheme } from "@material-ui/core/styles";

const palette = {
  primary: {
    light: "#060C37",
    main: "#060C37",
    dark: "#020412",
    contrastText: "#fff",
  },
  secondary: {
    light: "#D00000",
    main: "#D00000",
    dark: "#D00000",
    contrastText: "#000",
  },
  type: "light",
};

const typography = {
  fontFamily: "cabin, sans-serif",
};

export default createMuiTheme({ palette, typography });
