import { AppLoading } from "expo";
import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import UdaciFitnessCalendar from "udacifitness-calendar";
import { addEntry, receiveEntries } from "../actions.js";
import { fetchCalendarResults } from "../utils/api";
import { white } from "../utils/colors.js";
import { getDailyReminderValue, timeToString } from "../utils/helpers";
import DateHeader from "./DateHeader";
import MetricCard from "./MetricCard.js";

class History extends Component {
  state = {
    ready: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then((allEntries) => dispatch(receiveEntries(allEntries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(() => this.setState(() => ({ ready: true })));
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => {
    return (
      <View style={styles.item}>
        {today ? (
          <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("EntryDetail", {
                entryId: key,
                formattedDate: formattedDate,
              })
            }
          >
            <MetricCard metrics={metrics} date={formattedDate} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderEmptyDate = (formattedDate) => {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>
          You didn't log any data on this day.
        </Text>
      </View>
    );
  };

  render() {
    const { entries } = this.props;
    const { ready } = this.state;

    if (ready === false) {
      return <AppLoading />;
    }
    return (
      <UdaciFitnessCalendar
        items={entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0, 0, 0, 0.24)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

function mapStateToProps(entries) {
  return {
    entries,
  };
}

export default connect(mapStateToProps)(History);
