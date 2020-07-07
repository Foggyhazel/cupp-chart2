import React, { useState } from "react";
import TestLine from "./components/TestLine";
import TestMultiPlot from "./components/TestMultiPlot";
import TestScatter from "./components/TestScatter";
import TestStackArea from "./components/TestStackArea";
import TestBar from "./components/TestBar";

import {
  View,
  SafeAreaView,
  ScrollView,
  Button,
  StyleSheet,
} from "react-native";

export default function App() {
  const [, update] = useState({});
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          <TestStackArea />
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
