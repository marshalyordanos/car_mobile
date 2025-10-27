import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import RNModal from "react-native-modal";

export default function StatusModal({
  visible,
  onClose,
  icon,
  title,
  message,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  type = "info",
}) {
  const colorMap = {
    success: "#2ecc71",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
  };

  return (
    <RNModal
      isVisible={visible}
      // onBackdropPress={onClose}
      backdropTransitionOutTiming={0}
      useNativeDriver
      style={{
        margin: 0,
        // justifyContent: "flex-start",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      backdropOpacity={0}
      statusBarTranslucent={true}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 22,
          marginHorizontal: 20,

          alignItems: "center",
        }}
      >
        {icon && <View style={{ marginBottom: 16 }}>{icon}</View>}

        {title ? (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 6,
              textAlign: "center",
            }}
          >
            {title}
          </Text>
        ) : null}

        {message ? (
          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              color: "#555",
              textAlign: "center",
            }}
          >
            {message}
          </Text>
        ) : null}

        <View style={{ flexDirection: "row", gap: 12 }}>
          {secondaryLabel ? (
            <TouchableOpacity
              onPress={onSecondaryPress}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: "#eee",
              }}
            >
              <Text>{secondaryLabel}</Text>
            </TouchableOpacity>
          ) : null}

          {primaryLabel ? (
            <TouchableOpacity
              onPress={onPrimaryPress}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: colorMap[type],
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {primaryLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </RNModal>
  );
}
