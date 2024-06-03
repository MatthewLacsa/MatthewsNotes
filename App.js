import {useState, useEffect, useLayoutEffect} from 'react';
import { SafeAreaView, Text, FlatList, View, TextInput, TouchableOpacity, Button } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './db';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

function MainNotes( {navigation} ) {
  const {data: searchData, error, isLoading} = useSearchNotesQuery("");
  const [addNote, { data: addNoteData, error: addNoteError}] = useAddNoteMutation();
  const [ deleteNote ] = useDeleteNoteMutation();
  const [searchBar, setSearchBar] = useState("");

  useEffect(() => {
    if(addNoteData != undefined) {
      navigation.navigate("Edit", {data: addNoteData});
    }

  }, [addNoteData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress = {() => navigation.navigate("Edit", { data: item }) } style = {tw `w-[98%] mb-0.5 mx-auto bg-red-300 rounded-lg px-1`}>
      <Text>{item.title} {item.content}</Text>
    </TouchableOpacity>
  )
  return (
    <View style={tw`flex-1 items-start justify-start bg-red-400`}>
    {searchData ? 
      <MasonryList
        style={tw`px-0.5 pt-0.5 pb-20`}
        data={searchData.filter(note => note.title.includes(searchBar))}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />  
      : <></>
    }
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity style = {tw`bg-red-100 p-2 m-6 rounded-lg `} onPress = {() => {addNote({title: "", content: ""})}}>
        <Text style = {tw`text-sm font-bold text-center `}>Add Note</Text>
        </TouchableOpacity>
        <TextInput placeholder="Search for a note" style={tw`h-8 p-2 bg-red-100 rounded-lg m-4 text-sm w-50`} value={searchBar} onChangeText={setSearchBar}/>
        </View>
    </View> 
  );
}

function EditScreen({ route, navigation }) {
  const [title, setTitle] = useState(route.params.data.title);
  const [content, setContent] = useState(route.params.data.content)
  const [saveNote, {}] = useUpdateNoteMutation(); 
  const [deleteNote, {}] = useDeleteNoteMutation();

  

  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.data.title });
  }, []);

  return (
    <View style={tw`flex-1 bg-red-400 p-2 items-center justify-center`}>
      <TextInput placeholder = "Please enter title" style = {tw`flex-1 bg-red-200 p-2`} value = {title} onChangeText={setTitle}/>
      <TextInput placeholder = "Please enter text" style = {tw`flex-1 bg-red-200 p-2`} value = {content} onChangeText={setContent}/>
      <TouchableOpacity style = {tw`bg-red-100 p-2 m-6 rounded-lg `} onPress = {() => saveNote({id: route.params.data.id, title, content,})} >
        <Text>Save Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style = {tw`bg-red-100 p-2 m-6 rounded-lg `} onPress = {() => { deleteNote({id: route.params.data.id}); navigation.goBack();} } >
        <Text>Delete Note</Text>
      </TouchableOpacity>
    </View>
  );
  
  useEffect(() => {
    if(route.params.data.title && route.params.data.content == "") {
      deleteNote({id: route.params.data.id}); 
      navigation.goBack();
    }

  }, [title, content]);
}

const Stack = createNativeStackNavigator();

export default function MyNotes() {
  return (
    //prop store added
    <Provider store={store}> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            options={{
              headerStyle: tw`bg-red-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`, 
              headerShadowVisible: false, 
            }}
            name="Note App"
            component={MainNotes}
          />
          <Stack.Screen
            options={{
              headerStyle: tw`bg-red-300 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`,
              headerShadowVisible: false,
            }}
            name="Edit"
            component={EditScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


