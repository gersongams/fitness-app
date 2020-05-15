import { Ionicons } from "@expo/vector-icons";
import { CommonActions } from "@react-navigation/native";
import React, { useReducer } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "../actions.js";
import { removeEntry, submitEntry } from "../utils/api";
import { purple, white } from "../utils/colors";
import {
  clearLocalNotification,
  getDailyReminderValue,
  getMetricMetaInfo,
  setLocalNotification,
  timeToString,
} from "../utils/helpers";
import CustomSlider from "./CustomSlider";
import CustomStepper from "./CustomStepper";
import DateHeader from "./DateHeader";
import TextButton from "./TextButton";

const SubmitBtn = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
};

const initialState = {
  run: 0,
  bike: 0,
  swim: 0,
  sleep: 0,
  eat: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        [action.payload.metric]: action.payload.count,
      };
    case "decrement":
      return {
        ...state,
        [action.payload.metric]: action.payload.count,
      };
    case "setValue":
      return {
        ...state,
        [action.payload.metric]: action.payload.count,
      };
    case "resetValues":
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const AddEntry = ({ navigation }) => {
  const [state, dispatchState] = useReducer(reducer, initialState);
  const dispatch = useDispatch();
  const alreadyLogged = useSelector((state) => {
    const key = timeToString();
    return state[key] && typeof state[key].today === "undefined";
  });

  const increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);
    const count = state[metric] + step;

    dispatchState({
      type: "increment",
      payload: {
        metric,
        count: count > max ? max : count,
      },
    });
  };

  const decrement = (metric) => {
    const { step } = getMetricMetaInfo(metric);
    const count = state[metric] - step;

    dispatchState({
      type: "decrement",
      payload: {
        metric,
        count: count < 0 ? 0 : count,
      },
    });
  };

  const slide = (metric, value) => {
    dispatchState({
      type: "setValue",
      payload: {
        metric,
        count: value,
      },
    });
  };

  const submit = () => {
    const key = timeToString();
    const entry = state;

    // Update Redux
    dispatch(
      addEntry({
        [key]: entry,
      })
    );

    // Updating state
    dispatchState({
      type: "resetValues",
    });

    // Navigate to home
    toHome();
    // Save to 'DB'
    submitEntry({ key, entry });

    // Clearn local notification
    clearLocalNotification().then(setLocalNotification);
  };

  const reset = () => {
    const key = timeToString();

    // Update redux
    dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );
    // Route to home
    toHome();

    // update DB
    removeEntry(key);
  };

  const toHome = () => {
    navigation.dispatch(
      CommonActions.goBack({
        key: "AddEntry",
      })
    );
  };

  const metaInfo = getMetricMetaInfo();

  if (alreadyLogged) {
    return (
      <View style={styles.center}>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
          size={100}
        />
        <Text>You already logged your information for today</Text>
        <TextButton style={{ padding: 10 }} onPress={reset}>
          Reset
        </TextButton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateHeader date={new Date().toLocaleDateString()} />
      {Object.keys(metaInfo).map((key) => {
        const { getIcon, type, ...rest } = metaInfo[key];
        const value = state[key];
        return (
          <View key={key} style={styles.row}>
            {getIcon()}
            {type === "slider" ? (
              <CustomSlider
                value={value}
                onChange={(value) => slide(key, value)}
                {...rest}
              />
            ) : (
              <CustomStepper
                value={value}
                onIncrement={() => increment(key)}
                onDecrement={() => decrement(key)}
                {...rest}
              />
            )}
          </View>
        );
      })}
      <SubmitBtn onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30,
  },
});

export default AddEntry;
