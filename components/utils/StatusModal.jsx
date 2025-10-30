import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
  loading = false, // ✅ new prop
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
      backdropTransitionOutTiming={0}
      useNativeDriver
      style={{
        margin: 0,
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
              onPress={!loading ? onSecondaryPress : null} // disable during loading
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: "#eee",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text>{secondaryLabel}</Text>
            </TouchableOpacity>
          ) : null}

          {primaryLabel ? (
            <TouchableOpacity
              onPress={!loading ? onPrimaryPress : null} // disable during loading
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                backgroundColor: colorMap[type],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: loading ? 0.8 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {primaryLabel}
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </RNModal>
  );
}
