import React from "react";
import { Text, View } from "react-native";
import { purple } from "../utils/colors";

const DateHeader = ({ date }) => {
  return (
    <View>
      <Text style={{ color: purple, fontSize: 25 }}>{date}</Text>
    </View>
  );
};

export default DateHeader;
