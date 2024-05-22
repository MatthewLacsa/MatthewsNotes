import { SafeAreaView, Text, FlatList, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 

const App = () => {
  const pressedButton = () => {
    Alert.alert('This is a work in progress!');
  };
  useDeviceContext(tw);

  return (
    <SafeAreaView style={tw`flex-1 bg-red-400`}>
        <View style = {tw `flex-1 justify-start items-start bg-red-400`}>
          <Text style={tw`text-5x1 font-bold mt-8 ml-2`}> Note App </Text>
          <View style={tw`flex-row w-full rounded-lg items-center m-2 p-2`}>
            <TouchableOpacity style = {tw`bg-red-100 p-1 rounded`} onPress = {pressedButton}>
              <Text style = {tw`text-lg font-bold`}>+</Text>
            </TouchableOpacity>
            <TextInput placeholder="Search for a note" style = {tw `h-9 p-2 bg-red-100 rounded m-2 text-sm`} />

          </View>
        </View>
      
    </SafeAreaView>
  );
};

export default App;


