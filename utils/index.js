import { StyleSheet } from "react-native";

export const isValidDate = (date) => {
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
};

export const formatPrice = (value) => {
  if (!value || isNaN(value)) return "0.00";
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (date) => {
  if (!isValidDate(date)) {
    console.warn("Invalid date in formatDate:", date);
    return "Invalid Date";
  }
  return date.toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  });
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  vehicleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  tripsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  vehicleDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  vehicleImage: {
    width: 96,
    height: 64,
    borderRadius: 8,
  },
  loginContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
  },
  inputContainer: {
    marginBottom: 16,
  },
  phoneInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  pickerContainer: {
    marginRight: 8,
  },
  picker: {
    width: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    color: "#000",
  },
  pickerFull: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 4,
    color: "#000",
  },
  pickerItem: {
    color: "#000",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    color: "#000",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 12,
    flex: 1,
  },
  totalContainer: {
    marginTop: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRowBold: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#000",
    textDecorationLine: "underline",
  },
  totalLabelBold: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  totalValue: {
    fontSize: 16,
    color: "#000",
  },
  totalValueFree: {
    fontSize: 16,
    color: "#16A34A",
  },
  totalValueBold: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  cancellationBox: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  cancellationIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cancellationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#000",
    marginLeft: 8,
    flex: 1,
  },
  linkText: {
    color: "#000",
    textDecorationLine: "underline",
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    padding: 16,
    backgroundColor: "#FFF",
  },
  bottomBarContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  taxesText: {
    fontSize: 12,
    color: "#666",
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: "#CCC",
  },
  continueButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  protectionContainer: {
    marginBottom: 16,
  },
  protectionOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  optionDetails: {
    marginTop: 8,
    marginLeft: 12,
  },
  optionDetail: {
    fontSize: 12,
    color: "#666",
  },
  optionPrice: {
    fontSize: 14,
    color: "#000",
    marginTop: 8,
    marginLeft: 12,
  },
});