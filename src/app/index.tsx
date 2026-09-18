import * as Device from "expo-device";
import { Platform, StyleSheet, Text, FlatList, Pressable, View, TextInput} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

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

  const [item, setItem] = useState("");
  const [lists, setLists] = useState<string[]>([]);

  const today = useTodayDate();
  const formatted = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!fontsLoaded) {
    return null;
  }


  function addItem() {
    if (item.trim() == ""){
      return;
    }
    setLists([...lists, item.trim()]);
    setItem("");
  }

  function deleteItem(index: number) {
    const newGroceries = lists.filter (
    (item, itemIndex) => itemIndex !== index
    );
    setLists(newGroceries);
    
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.dataTitle}>{formatted}</Text>
        <Text style={styles.subtitle}>To-Do List</Text>
        <FlatList 
          style={styles.listContainer}
          data={lists}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => 
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
            <Pressable onPress={() => deleteItem(index)}>
              <Ionicons name="trash" size={24} color="#7a3fff" />
            </Pressable>
          </View>}
        />

        <TextInput 
          style={styles.input}
          placeholder="Add an item...."
          placeholderTextColor= "#6b7280"
          value={item}
          onChangeText={setItem}
        />
        <Pressable style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
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
  },
  listContainer: {

  },
  listItem: {

  },
  listText: {

  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 15,
    padding: 12,
    width: "50%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxWidth: 420,
    color: "black",
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#7a3fff",
    width: 70,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 42,
    color: "white",
    textAlign: "center",
  },
});
