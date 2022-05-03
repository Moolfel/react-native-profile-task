import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  PermissionsAndroid,
} from 'react-native';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [uri, setUri] = useState('');

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setUri(response.assets[0].uri);
      });
    }
  };

  const selectImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      presentationStyle: 'fullScreen',
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchImageLibrary(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        setUri(response.assets[0].uri);
      });
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black', color: 'white'}}>
      <Text style={styles.titleText}>Profile Picture</Text>
      <Text style={styles.description}>
        Upload Your Photo so that you can optionally display to others.
      </Text>

      <View style={styles.middleContainer}>
        {uri === '' ? (
          <Image
            source={require('./assets/icon.jpeg')}
            style={styles.imageStyle}
          />
        ) : (
          <Image source={{uri: uri}} style={styles.imageStyle} />
        )}
      </View>
      <View style={styles.container}>
        {/* <Text style={styles.textButtonStyle}>{uri}</Text> */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textButtonStyle}>Add a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonSkipStyle}
          onPress={() => alert('You are skiping ')}>
          <Text style={styles.textButtonStyle}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.container}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                captureImage('photo');
                setModalVisible(!modalVisible);
              }}
              style={styles.buttonWithIconStyle}>
              <Image
                source={require('./assets/icon.jpeg')}
                style={styles.cameraIcon}
              />
              <Text style={styles.textStyle}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
                selectImage('photo');
              }}
              style={styles.buttonWithIconStyle}>
              <Image
                source={require('./assets/im.png')}
                style={styles.cameraIcon}
              />
              {/* <Entypo name="image" size={25} color="white" /> */}
              <Text style={styles.textStyle}>Choose a Picture</Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  middleContainer: {
    flex: 1,
    padding: 100,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 20,
    color: '#fff',
    padding: 20,
  },
  textStyle: {
    padding: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingVertical: 20,
  },
  textButtonStyle: {
    padding: 10,
    color: 'white',
    textAlign: 'center',
  },
  buttonWithIconStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    marginVertical: 10,
    width: '100%',
  },
  buttonSkipStyle: {
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 5,
    marginVertical: 10,
    width: '100%',
  },
  cameraIcon: {
    width: 40,
    height: 40,
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#BD6EE9',
    padding: 5,
    marginVertical: 10,
    width: '100%',
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'left',
    color: 'white',
    paddingLeft: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  modalView: {
    // marginTop: 500,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 15,
    height: 200,
    borderTopColor: 'rgba(145, 145, 145, 0.424)',
    borderLeftColor: 'rgba(145, 145, 145, 0.424)',
    borderRightColor: 'rgba(145, 145, 145, 0.424)',
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
