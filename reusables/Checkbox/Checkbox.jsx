import { Checkbox } from "react-native-paper";
import { theme } from "../../app/util/theme";
import { checkBoxStyles as styles } from "./checkboxstyles";

const CheckBox = ({ label, value, setValue }) => {
  return (
    <Checkbox.Item
      style={styles.checkboxStyle}
      color={theme.tertirary}
      onPress={() => setValue(!value)}
      label={label}
      status={value === true ? "checked" : "unchecked"}
    />
  );
};

export default CheckBox;
