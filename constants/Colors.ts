const tintColorLight = "#35A8BB"; // tad-green-4
const tintColorDark = "#fff";

export const Colors = {
  light: {
    // Core UI Colors
    text: "#404968", // tad-text-2 - for primary text
    background: "#fff", // tad-white
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // Green Variants
    green: {
      100: "#2F83A1", // tad-green-1
      200: "#35A8BB", // tad-green-4
      300: "#4DBBCD", // tad-green-5
    },

    // Mint Variants
    mint: {
      100: "#74CDC4", // tad-mint-4
      200: "#8ADFD9", // tad-mint-3
      300: "#CAFEEE", // tad-mint-5
    },

    // Orange Variants
    orange: {
      100: "#F8BE5D", // tad-orange-1
      200: "#FAB584", // tad-orange-2
      300: "#FDE4D2", // tad-orange-4
    },

    // Pink Variants
    pink: {
      100: "#FF8B88", // tad-pink-1
      200: "#FF9494", // tad-pink-2
      300: "#FFBDBD", // tad-pink-3
      400: "#FFE5E5", // tad-pink-4
    },

    // Text/Gray Variants
    textGray: {
      100: "#404968", // tad-text-1
      200: "#505A84", // tad-text-2
      300: "#606C9E", // tad-text-3
      400: "#7983AE", // tad-text-4
      500: "#959ABD", // tad-text-5
    },

    // Additional UI Colors
    success: "#4DBBCD", // tad-green-5
    warning: "#F8BE5D", // tad-orange-1
    error: "#FF8B88", // tad-pink-1
    info: "#35A8BB", // tad-green-4
    disabled: "#959ABD", // tad-text-5
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
