const tintColorLight = "#1FAAB9"; // tad-green-3
const tintColorDark = "#fff";

export const Colors = {
  light: {
    // Core UI Colors
    text: "#2B3465", // tad-text-1 - for primary text
    background: "#fff", // tad-white
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,

    // Green Variants (tad-green Brand)
    green: {
      100: "#1a535c", // tad-green-1
      200: "#23707c", // tad-green-2
      300: "#2c8c9c", // tad-green-3
      400: "#35a9bb", // tad-green-4
      500: "#4dbbcd", // tad-green-5
    },

    // Mint Variants (tad-mint Brand)
    mint: {
      100: "#4acdc4", // tad-mint-1
      200: "#6ad6ce", // tad-mint-2
      300: "#8adfd9", // tad-mint-3
      400: "#4acdc4", // tad-mint-4
      500: "#caf0ee", // tad-mint-5
    },

    // Orange Variants
    orange: {
      100: "#F8B253", // tad-orange-1
      200: "#FFD181", // tad-orange-2
      300: "#FFDA98", // tad-orange-3
      400: "#FFE3B3", // tad-orange-4
      500: "#FFEED0", // tad-orange-5
    },

    // Pink Variants
    pink: {
      100: "#FF8281", // tad-pink-1
      200: "#FF9A9A", // tad-pink-2
      300: "#FEB2B2", // tad-pink-3
      400: "#FFD2D2", // tad-pink-4
    },

    // Text/Gray Variants
    textGray: {
      100: "#2B3465", // tad-text-1
      200: "#3F4570", // tad-text-2
      300: "#565D84", // tad-text-3
      400: "#6B7191", // tad-text-4
      500: "#9497AB", // tad-text-5
      600: "#C6C8D4", // tad-text-6
      700: "#EFEFF2", // tad-text-7
    },

    // Additional UI Colors
    success: "#1FAAB9", // tad-green-3
    warning: "#F8B253", // tad-orange-1
    error: "#FF8281", // tad-pink-1
    info: "#35C3D9", // tad-green-4
    disabled: "#9497AB", // tad-text-5
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
