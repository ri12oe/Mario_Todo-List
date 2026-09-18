import * as Device from "expo-device";
import { Platform, StyleSheet, Text, TextInputChangeEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useCallback, useEffect, useState } from "react";

export default function HomeScreen() {
  function getTodayKey() {
    return new Date().toISOString().split("T")[0]; // 2026-09-18
  }

  function useTodayDate() {
    const [today, setToday] = useState(getTodayKey());

    useEffect(() => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = nextMidnight.getTime() - now.getTime();

      const timeout = setTimeout(() => {
        setToday(getTodayKey());
      }, msUntilMidnight);

      return () => clearTimeout(timeout);
    }, [today]);

    return today;
  }

  function TodayDisplay() {
    const today = useTodayDate();
    const formatted = new Date(today).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return <Text style={styles.dataTitle}>Today is: {formatted}</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TodayDisplay />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  dataTitle: {
    color: "white",
  },
});
