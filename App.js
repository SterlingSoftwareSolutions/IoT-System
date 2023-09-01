import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView, PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using FontAwesome icons
import SlideButton from 'rn-slide-button';
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  PermissionsAndroid,
} from 'react-native';
import RNBluetoothClassic, {
  BluetoothDevice
} from 'react-native-bluetooth-classic';


const App = () => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const EXECUTION_TIME = 5000; // milliseconds

  function requestPermissions() {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }

  useState(() => {
    requestPermissions();
  }, [])

  async function getDevice() {
    let hc05 = await RNBluetoothClassic.connectToDevice('00:19:10:08:4D:6D');
    return hc05;
  }

  async function openRoof() {
    console.log("Opening Roof");
    device = await getDevice();
    device.write('1');
    await delay(EXECUTION_TIME);
    device.write('0');
  }

  async function closeRoof() {
    console.log("Closing Roof");
    device = await getDevice();
    device.write('2');
    await delay(EXECUTION_TIME);
    device.write('0');
  }

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon name="bell" size={40} color="white" style={styles.bell} />
          </View>
          <View style={styles.horizontal}>
            <View style={{ width: "60%", padding: 5 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Surveilance System</Text>
              <ImageBackground source={require('./src/images/Rectangle4.jpg')} resizeMode="cover" style={{ height: 240, borderRadius: 10, overflow: 'hidden', justifyContent: "flex-end", padding: 5, marginTop: 5, borderWidth: 1, borderColor: '#ffffffa0' }}>
                <SlideButton
                  title=">>"
                  icon={
                    <Image
                      source={require('./src/images/red_on_off_button.png')}
                      style={{ width: "75%", height: "75%" }}
                    />
                  }
                  containerStyle={{ backgroundColor: '#ffffffaa' }}
                  underlayStyle={{ backgroundColor: '#00ff00aa' }}
                  thumbStyle={{ borderColor: 'red', borderWidth: 2 }}
                  height="40"
                />
              </ImageBackground>
            </View>
            <View style={{ width: "40%", padding: 5 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Status</Text>
              <View style={{ height: 240, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 10, overflow: 'hidden', backgroundColor: "#ffffffaa", marginTop: 5, borderWidth: 2, borderColor: '#ffffff' }}>
                <Text style={{ fontSize: 12 }}>Surveillance system on</Text>
                <Text style={{ fontSize: 12 }}>Water level reached</Text>
              </View>
            </View>
          </View>
          <View style={styles.horizontal}>
            <View style={{ width: "45%", paddingLeft: 35, marginTop: 20 }}>
              <Text style={{ color: 'white', fontSize: 16, marginTop: 5 }}>Water Percentage</Text>
              <Text style={{ color: '#121212', fontSize: 26, fontWeight: '800' }}>65%</Text>
              <Text style={{ color: 'white', fontSize: 16, marginTop: 5 }}>Water Pressure</Text>
              <Text style={{ color: '#121212', fontSize: 26, fontWeight: '800' }}>144</Text>
              <Text style={{ color: 'white', fontSize: 16, marginTop: 5 }}>Soil Moisture</Text>
              <Text style={{ color: '#121212', fontSize: 26, fontWeight: '800' }}>22%</Text>
            </View>
            <View style={{ width: "65%", padding: 15, justifyContent: 'center', alignItems: 'START' }}>
              <View style={{ backgroundColor: "#121212", width: 190, height: 190, borderRadius: 9999, overflow: 'hidden', padding: 10, borderWidth: 1, borderColor: '#aaa' }}>
                <View style={{ backgroundColor: "#aaaaaa", width: 170, height: 170, borderRadius: 9999, overflow: 'hidden', justifyContent: "flex-end" }}>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, zIndex: 4, top: "30%" }}>65%</Text>
                  <View style={{ backgroundColor: "#2e3efe", width: 170, height: 120, overflow: 'hidden' }}>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.horizontal}>
            <View style={{ width: "33%", padding: 5 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>Water Tank Motor</Text>
              <View style={{ height: 140, borderRadius: 10, overflow: 'hidden', justifyContent: "flex-end", padding: 5, backgroundColor: "#121212", marginTop: 5, borderWidth: 1, borderColor: '#ffffffa0' }}>
                <SlideButton
                  title=">>"
                  icon={
                    <Image
                      source={require('./src/images/red_on_off_button.png')}
                      style={{ width: "75%", height: "75%" }}
                    />
                  }
                  containerStyle={{ backgroundColor: '#ffffffaa' }}
                  underlayStyle={{ backgroundColor: '#00ff00aa' }}
                  thumbStyle={{ borderColor: 'red', borderWidth: 2 }}
                  height="40"
                />
              </View>
            </View>
            <View style={{ width: "33%", padding: 5 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>Garden Light</Text>
              <View style={{ height: 140, borderRadius: 10, overflow: 'hidden', justifyContent: "flex-end", padding: 5, backgroundColor: "#121212", marginTop: 5, borderWidth: 1, borderColor: '#ffffffa0' }}>
                <SlideButton
                  title=">>"
                  icon={
                    <Image
                      source={require('./src/images/red_on_off_button.png')}
                      style={{ width: "75%", height: "75%" }}
                    />
                  }
                  containerStyle={{ backgroundColor: '#ffffffaa' }}
                  underlayStyle={{ backgroundColor: '#00ff00aa' }}
                  thumbStyle={{ borderColor: 'red', borderWidth: 2 }}
                  height="40"
                />
              </View>
            </View>
            <View style={{ width: "33%", padding: 5 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 14 }}>Open Roof</Text>
              <View style={{ height: 140, borderRadius: 10, overflow: 'hidden', justifyContent: "flex-end", padding: 5, backgroundColor: "#121212", marginTop: 5, borderWidth: 1, borderColor: '#ffffffa0' }}>
                <SlideButton
                  title=">>"
                  icon={
                    <Image
                      source={require('./src/images/red_on_off_button.png')}
                      style={{ width: "75%", height: "75%" }}
                    />
                  }
                  containerStyle={{ backgroundColor: '#ffffffaa' }}
                  underlayStyle={{ backgroundColor: '#00ff00aa' }}
                  thumbStyle={{ borderColor: 'red', borderWidth: 2 }}
                  height="40"
                  onReachedToEnd={openRoof}
                  onReachedToStart={closeRoof}
                />
              </View>
            </View>
          </View>
        </View >
      </ScrollView>
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30, // Add padding around
    paddingHorizontal: 5, // Add padding around
    backgroundColor: '#424242',
    height: '100%'
  },
  iconContainer: {
    alignItems: 'flex-end'
  },
  bell: {
    backgroundColor: '#323232',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    // add shadow here
  },
  horizontal: {
    flexDirection: 'row',
    marginTop: 10
  },
});

export default App;
