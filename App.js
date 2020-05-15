import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Constants from "expo-constants";
import React from "react";
import { Platform, StatusBar, View } from "react-native";
import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { createStore } from "redux";
import AddEntry from "./src/Components/AddEntry";
import EntryDetail from "./src/Components/EntryDetail";
import History from "./src/Components/History";
import reducer from "./src/reducers";
import { purple, white } from "./src/utils/colors";

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const RouteConfigs = {
  History: {
    name: "History",
    component: History,
    options: {
      tabBarIcon: ({ tintColor }) => (
        <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
      ),
      title: "History",
    },
  },
  AddEntry: {
    component: AddEntry,
    name: "Add Entry",
    options: {
      tabBarIcon: ({ tintColor }) => (
        <FontAwesome name="plus-square" size={30} color={tintColor} />
      ),
      title: "Add Entry",
    },
  },
};

const TabNavigatorConfig = {
  initialRouteName: "History",
  navigationOptions: {
    header: null,
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === "ios" ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === "ios" ? white : purple,
      shadowColor: "rgba(0, 0, 0, 0.24)",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowRadius: 6,
      shadowOpacity: 1,
    },
  },
};

const Tab =
  Platform.OS === "ios"
    ? createBottomTabNavigator()
    : createMaterialTopTabNavigator();

const TabNav = () => (
  <Tab.Navigator {...TabNavigatorConfig}>
    <Tab.Screen {...RouteConfigs["History"]} />
    <Tab.Screen {...RouteConfigs["AddEntry"]} />
  </Tab.Navigator>
);

// Config for StackNav
const StackNavigatorConfig = {
  headerMode: "screen",
};
const StackConfig = {
  TabNav: {
    name: "Home",
    component: TabNav,
    options: { headerShown: false },
  },
  EntryDetail: {
    name: "EntryDetail",
    component: EntryDetail,
    options: {
      headerTintColor: white,
      headerStyle: {
        backgroundColor: purple,
      },
      title: "Entry Detail",
    },
  },
};
const Stack = createStackNavigator();

const MainNav = () => (
  <Stack.Navigator {...StackNavigatorConfig}>
    <Stack.Screen {...StackConfig["TabNav"]} />
    <Stack.Screen {...StackConfig["EntryDetail"]} />
  </Stack.Navigator>
);

const App = () => (
  <Provider store={createStore(reducer)}>
    <View style={{ flex: 1 }}>
      <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
      <NavigationContainer>
        <MainNav />
      </NavigationContainer>
      {/* <Tabs /> */}
      {/* <View style={{ marginTop: 20 }} /> */}
      {/* <History /> */}
      {/* <AddEntry /> */}
      {/* </View> */}
    </View>
  </Provider>
);

export default App;
