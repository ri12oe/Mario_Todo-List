import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";

type TodoItem = {
  id: number;
  text: string;
  done: boolean;
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
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
  const [lists, setLists] = useState<TodoItem[]>([]);

  const today = useTodayDate();
  const formatted = new Date(today).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function addItem() {
    if (item.trim() === "") {
      return;
    }

    setLists((current) => [
      ...current,
      {
        id: Date.now(),
        text: item.trim(),
        done: false,
      },
    ]);

    setItem("");
  }

  function toggleDone(id: number) {
    setLists((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  }

  function deleteItem(id: number) {
    setLists((current) => current.filter((todo) => todo.id !== id));
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.dataTitle}>{formatted}</Text>
        <Text style={styles.subtitle}>To-Do List</Text>

        <FlatList
          style={styles.listContainer}
          data={lists}
          keyExtractor={(todo) => todo.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Pressable
                onPress={() => toggleDone(item.id)}
                style={styles.checkButton}
              >
                <Ionicons
                  name={
                    item.done ? "checkmark-circle" : "checkmark-circle-outline"
                  }
                  size={24}
                  color="#fff"
                />
              </Pressable>

              <Text style={[styles.listText, item.done && styles.checkedText]}>
                {item.text}
              </Text>

              <Pressable onPress={() => deleteItem(item.id)}>
                <Ionicons name="trash" size={24} color="#eee" />
              </Pressable>
            </View>
          )}
        />

        <TextInput
          style={styles.input}
          placeholder="Add an item..."
          placeholderTextColor="#6b7280"
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
    marginTop: 32,
  },
  subtitle: {
    color: "black",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
  },
  listContainer: {
    width: "100%",
    maxWidth: 420,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7a3fff",
    justifyContent: "space-between",
    borderRadius: 15,
    width: "100%",
    padding: 15,
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkButton: {
    marginRight: 10,
  },
  listText: {
    flex: 1,
    color: "#eee",
    fontFamily: "Poppins_600SemiBold",
  },
  checkedText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 15,
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "black",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Poppins_600SemiBold",
    backgroundColor: "#fff",
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
    fontFamily: "Poppins_600SemiBold",
  },
});
