import {useEffect, useLayoutEffect} from 'react';
import { SafeAreaView, Text, FlatList, View, TextInput, TouchableOpacity, Button } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation } from './db';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
function MainNotes( {navigation} ) {
  const {data: searchData, error, isLoading} = useSearchNotesQuery("");
  const [addNote, { data: addNoteData, error: addNoteError}] = useAddNoteMutation();
  const [ deleteNote ] = useDeleteNoteMutation();

  useEffect(() => {
    if(addNoteData != undefined) {
      console.log(addNoteData.title);
      navigation.navigate("Edit", {data: addNoteData});
    }

  }, [addNoteData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress = {() => deleteNote(item) } style = {tw `w-[98%] mb-0.5 mx-auto bg-red-300 rounded-lg px-1`}>
      <Text>{item.title} {item.id}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={tw`flex-1 items-start justify-start bg-red-400`}>
    {searchData ? 
      <MasonryList
        style={tw`px-0.5 pt-0.5 pb-20`}
        data={searchData}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />  
      : <></>
    }
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity style = {tw`bg-red-100 p-2 m-6 rounded-lg `} onPress = {() => {addNote({title: "test", content: "content"})}}>
        <Text style = {tw`text-sm font-bold text-center `}>Add Note</Text>
        </TouchableOpacity>
        <TextInput placeholder="Search for a note" style={tw`h-8 p-2 bg-red-100 rounded-lg m-4 text-sm w-50`} />
        </View>
    </View> 
  );
}
function EditScreen({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.data.title });
  }, []);

  return (
    <View style={tw`flex-1 items-center justify-center bg-red-400`}>
      <Text style={tw`text-lg text-white`}>Edit Screen {route.params.data.title} {route.params.data.id}</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function MyNotes() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            options={{
              headerStyle: tw`bg-red-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Note App"
            component={MainNotes}
          />
          <Stack.Screen
            options={{
              headerStyle: tw`bg-red-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false, // gets rid of border on device
            }}
            name="Edit"
            component={EditScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


