import { InputStyles as styles } from "./inputStyles";
import { TextInput, View, Text } from "react-native";

const InputField = ({
  type,
  name,
  label,
  placeholder,
  value,
  onchange,
  theme,
}) => {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        name={name}
        secureTextEntry={type === "password"}
        type={type}
        placeholder={placeholder ? placeholder : ""}
        value={value}
        onChangeText={onchange}
        style={styles.fieldContainer}
        placeholderTextColor="black"
      />
    </View>
  );
};

export default InputField;
