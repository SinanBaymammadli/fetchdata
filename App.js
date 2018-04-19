import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Image
} from "react-native";
import axios from "axios";
import moment from "moment";

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

export default class App extends Component {
  state = {
    data: null,
    loading: false,
    error: null
  };

  fetchData = async () => {
    this.setState({
      loading: true
    });

    const data = JSON.stringify({
      login: "mail@example.com",
      password: "example",
      uuid: "12345678"
    });

    try {
      // const response = await axios.post(
      //   "http://sportyness.pal.az/api/v1.0/?act=login",
      //   data
      // );

      const response = await axios.get(
        "http://sportyness.pal.az/api/v1.0/?act=login&login=mail@example.com&password=example&uuid=12345678"
      );

      if (response.data.status === "success") {
        this.setState({
          data: response.data.value,
          loading: false
        });
      } else {
        this.setState({
          error: response.data.details,
          loading: false
        });
      }
    } catch (error) {
      this.setState({
        error: error,
        loading: false
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.btn}>
          <Button title="Fetch data" onPress={this.fetchData} />
        </View>

        {this.state.loading && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}

        {this.state.data && (
          <ScrollView>
            <View style={styles.profile}>
              <Image
                style={{ width: 50, height: 50 }}
                source={{
                  uri: this.state.data.avatar
                }}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{this.state.data.fullname}</Text>
                <Text style={styles.text}>{this.state.data.country_name}</Text>
                <Text style={styles.text}>{this.state.data.login}</Text>
                <Text style={styles.text}>
                  Rating: {this.state.data.rating}
                </Text>
                <Text style={styles.text}>
                  Last active:{" "}
                  {Math.ceil(
                    moment
                      .duration(moment().diff(this.state.data.last_active))
                      .asMinutes()
                  )}{" "}
                  min. ago
                </Text>
              </View>
            </View>
          </ScrollView>
        )}

        {this.state.error && <Text>{this.state.error}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: "#F5FCFF"
  },
  btn: {
    margin: 15
  },
  profile: {
    flexDirection: "row"
  },
  info: {
    marginLeft: 15
  },
  name: {
    fontSize: 18,
    color: "#000"
  },
  text: {
    fontSize: 16
  }
});
