import React from "react";
import { StyleSheet, View } from "react-native";
import SimpleChart from "./src/examples/SimpleChart";

export default function App() {
  return (
    <View style={styles.container}>
      <SimpleChart />
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
