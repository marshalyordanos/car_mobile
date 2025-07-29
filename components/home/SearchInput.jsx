import {
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import icons from "../../constants/icons";
const SearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.con}>
      {/* <Text>SearchInput</Text> */}
      <View style={[styles.container, isFocused && styles.input_focused]}>
        <TextInput
          placeholder="Search here"
          placeholderTextColor={"gray"}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "black",
          paddingHorizontal: 15,
          height: 43,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={icons.search}
          style={{ width: 17, height: 17, tintColor: "white" }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  con: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  container: {
    height: 44,
    // borderWidth: 1,
    borderColor: "lightgray",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: "#f1f0f0",
    // width: "100%",
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    // borderWidth: 1,
    width: "100%",
    fontSize: 16,
    lineHeight: 24,
  },
  input_focused: {
    borderColor: "#393381",
    alignItems: "center",
  },
});
