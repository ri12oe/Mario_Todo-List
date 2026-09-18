import * as Device from "expo-device";
import { Platform, StyleSheet, Text, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useCallback, useEffect, useState } from "react";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

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

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  const today = useTodayDate();
  const formatted = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.dataTitle}>{formatted}</Text>
        <Text style={styles.subtitle}>To-Do List</Text>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#eee",
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
    color: "#7A3FFF",
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    textDecorationLine: "underline",
  },
  subtitle: {
    color: "black",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  }
});
