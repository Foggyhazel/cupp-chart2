import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";

import TestLine from "./src/examples/TestLine";
import TestHousePrice from "./src/examples/TestHousePrice";

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <TestHousePrice />
        </ScrollView>
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
