import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using FontAwesome icons
import SlideButton from 'rn-slide-button';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  ImageBackground,
  Image,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);

  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  // pair with device first before connecting to it
  const connectToPeripheral = peripheral => {
    BleManager.createBond(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };
  // disconnect from device
  const disconnectFromPeripheral = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // render list of bluetooth devices
  function openRoof() {
    startScan();
    console.log("Opening Roof");
  }
  function closeRoof() {
    console.log("Closing Roof");
  }
  return (
    <GestureHandlerRootView>
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
