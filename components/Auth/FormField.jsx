import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import icons from "../../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  showPassword,
  onTogglePassword,
  ...props
}) => {
  const [internalShowPassword, setInternalShowPassword] = React.useState(false);

  const isPasswordVisible =
    showPassword !== undefined ? showPassword : internalShowPassword;
  const togglePassword = onTogglePassword || setInternalShowPassword;

  return (
    <View style={[styles.con, otherStyles]}>
      <Text style={styles.txt}>{title}</Text>
      <View style={styles.field_con}>
        <TextInput
          style={styles.textInput}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="grays"
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Password" ||
              title === "Confirm Password" ||
              title === "የይለፍ ቃል" ||
              title === "የይለፍ ቃል አረጋግጥ") &&
            !isPasswordVisible
          }
          {...props}
        />
        {(title === "Password" ||
          title === "Confirm Password" ||
          title === "የይለፍ ቃል" ||
          title === "የይለፍ ቃል አረጋግጥ") && (
          <TouchableOpacity onPress={() => togglePassword(!isPasswordVisible)}>
            <Image
              style={{
                width: 24,
                height: 24,
                color: "grey",
              }}
              resizeMode="contain"
              source={!isPasswordVisible ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  con: {},
  txt: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
  },
  field_con: {
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: "#e7ebf0",
    borderRadius: 10,
    borderColor: "gray",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#e7ebf0",
    borderRadius: 8,
  },
});
