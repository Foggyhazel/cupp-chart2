import React from "react";
import { StyleSheet, View } from "react-native";
import SimpleChart2 from "./src/examples/SimpleChart2";

export default function App() {
  return (
    <View style={styles.container}>
      <SimpleChart2 />
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
