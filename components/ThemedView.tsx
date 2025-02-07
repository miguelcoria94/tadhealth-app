import { View, type ViewProps } from "react-native";
import { Colors } from "@/constants/Colors";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "card" | "elevated";
};

export function ThemedView({
  style,
  lightColor,
  variant = "default",
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = lightColor || Colors.light.background;

  return (
    <View
      style={[{ backgroundColor }, variants[variant], style]}
      {...otherProps}
    />
  );
}

const variants = {
  default: {
    backgroundColor: Colors.light.background,
  },
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
  },
  elevated: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.textGray[100],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
};
