import { Text, Pressable } from "react-native";
import { ButtonStyles as styles } from "./buttonStyles";

const Button = ({ label, onPress, theme, textTheme, children }) => {
  const getButtonThemeStyle = (theme) => {
    if (theme) {
      if (theme === "dark") {
        return styles.darkTheme;
      } else if (theme === "danger") {
        return styles.dangerTheme;
      } else {
        return styles.darkLight;
      }
    } else {
      return null;
    }
  };
  const getButtonColorStyle = (theme) => {
    if (theme) {
      if (theme === "dark") {
        return styles.darkThemeFont;
      } else if (theme === "danger") {
        return styles.darkThemeFont;
      } else {
        return styles.lightThemeFont;
      }
    } else {
      if (textTheme && textTheme === "light") {
        return styles.lightThemeFont;
      }
      return styles.darkThemeFont;
    }
  };
  return (
    <Pressable
      onPress={onPress}
      style={[styles.buttonContainer, getButtonThemeStyle(theme)]}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.buttonLabel, getButtonColorStyle(theme)]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default Button;
