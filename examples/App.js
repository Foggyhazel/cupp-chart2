import React from "react";
import TestLine from "./components/TestLine";
import TestMultiPlot from "./components/TestMultiPlot";
import {
  View,
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <TestMultiPlot />
        </ScrollView>
        <Button title="Update" onPress={() => update({})} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
