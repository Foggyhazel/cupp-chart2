import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Button,
} from "react-native";

import TestLine from "./src/examples/TestLine";
import TestScatter from "./src/examples/TestScatter";
import TestBar from "./src/examples/TestBar";
import TestStackArea from "./src/examples/TestStackArea";
import TestMultiPlot from "./src/examples/TestMultiPlot";

export default function App() {
  const [, update] = useState({});
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
