import { Text, type TextProps, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "label"
    | "caption";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = lightColor || Colors.light.textGray[100]; // Using our new text color

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textGray[100],
    fontWeight: "400",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: Colors.light.textGray[100],
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
    color: Colors.light.textGray[100],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: Colors.light.textGray[100],
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.tint,
    fontWeight: "500",
  },
  // Added new text types
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: Colors.light.textGray[300],
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
    color: Colors.light.textGray[300],
  },
});
