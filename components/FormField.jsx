import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import icons from "../constants/icons";
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
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
          secureTextEntry={title === "Password" && !showPassword}
        />
        {(title === "Password" ||
          title === "Confirm Password" ||
          title == "የይለፍ ቃል አረጋግጥ" ||
          title === "የይለፍ ቃል") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              style={{
                width: 24,
                height: 24,
                color: "grey",
                // backgroundColor: "red",
              }}
              resizeMode="contain"
              source={!showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  con: {
    // borderWidth: 2,
  },
  txt: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
  },
  field_con: {
    // width: "100%",
    height: 60,
    paddingHorizontal: 16,
    // backgroundColor: "whitesmoke",
    // borderWidth: 1,
    marginRight: 0,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#e7ebf0",
    borderRadius: 10,
    borderColor: "gray",

    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#e7ebf0",
    borderRadius: 8,
  },
});
