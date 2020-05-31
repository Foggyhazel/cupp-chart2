import React from "react";
import { StyleSheet, View, ScrollView, SafeAreaView } from "react-native";
import SimpleChart2 from "./src/examples/SimpleChart2";
import TestStack from "./src/examples/TestStack";
import TestLine from "./src/examples/TestLine";
import TestHousePrice from "./src/examples/TestHousePrice";
import TestBar from "./src/examples/TestBar";

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>
          {/*<TestStack />
          <SimpleChart2 />
          <TestLine />
          <TestHousePrice />*/}
          <TestBar />
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
