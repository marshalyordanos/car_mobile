import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import styles from "./Styles";

export class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    console.log("ErrorBoundary caught an error:", error);
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <Text style={styles.errorText}>Something went wrong</Text>;
    }
    return this.props.children;
  }
}

/* Icons */
export const ArrowLeftIcon = () => <MaterialIcons name="arrow-back" style={styles.icon} />;
export const ShareIcon = () => <MaterialIcons name="share" style={styles.icon} />;
export const HeartIcon = () => <MaterialIcons name="favorite-outline" style={styles.icon} />;
export const StarIcon = ({ filled = false }) => (
  <MaterialIcons
    name="star"
    style={[styles.icon, { color: filled ? "#000000" : "#B0B0B0" }]}
  />
);
export const EditIcon = () => (
  <View style={styles.editIcon}>
    <MaterialIcons name="edit" style={styles.editIconText} />
  </View>
);
export const HelpIcon = () => <MaterialIcons name="help-outline" style={styles.icon} />;

/* Render helpers */
export const renderRatingBar = (category) => (
  <View key={category} style={styles.ratingRow}>
    <Text style={styles.ratingCategory}>{category}</Text>
    <View style={styles.ratingBarContainer}>
      <View style={styles.ratingBarBg}>
        <View style={styles.ratingBarFill} />
      </View>
      <Text style={styles.ratingValue}>5.0</Text>
    </View>
  </View>
);

export const renderFeatureChip = (icon, text) => (
  <View key={text} style={styles.featureChip}>
    <MaterialIcons name={icon || "check-circle"} style={styles.featureIcon} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

export const renderReviewCard = (review) => (
  <View key={review.key || review.id} style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.avatar} />
      <View>
        <Text style={styles.reviewerName}>{review.reviewerId || "Guest"}</Text>
        <Text style={styles.reviewDate}>
          {review.createdAt
            ? new Date(review.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Date not available"}
        </Text>
      </View>
    </View>
    <View style={styles.starsContainer}>
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < (review.rating || 0)} />
      ))}
    </View>
    <Text style={styles.reviewText}>{review.comment || "No comment"}</Text>
  </View>
);