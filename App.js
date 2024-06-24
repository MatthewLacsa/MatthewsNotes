import {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { Image, SafeAreaView, Text, FlatList, View, TextInput, TouchableOpacity, Button } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 
import MasonryList from '@react-native-seoul/masonry-list'
import { useSearchNotesQuery, useAddNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from './db';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//function: contains main page functionality including search, adding notes and editing
function MainNotes( {navigation} ) {
  //variables used from dependencies
  const {data: searchData} = useSearchNotesQuery("");
  const [addNote, { data: addNoteData, error: addNoteError}] = useAddNoteMutation();
  const [ deleteNote ] = useDeleteNoteMutation();
  const [searchBar, setSearchBar] = useState("");

  //if data of the note is not empty, navigate to "edit" screen
  useEffect(() => {
    if(addNoteData != undefined) {
      navigation.navigate("Edit", {data: addNoteData});
    }

  }, [addNoteData]);
  //navigate to edit if clicked, and show title and content
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress = {() => navigation.navigate("Edit", { data: item }) } style = {tw `w-[98%] mb-0.5 mx-auto bg-red-300 rounded-lg px-1`}>
      <Text style ={tw `font-bold text-4`}>{item.title}</Text>
      <Text>{item.content}</Text>
    </TouchableOpacity>
  )
  return (


    <View style={tw`flex-1 items-start justify-start bg-red-400`}>
    <View style={tw`flex-row items-center`} > 
    <TextInput placeholder="Search for a note" style={tw`h-8 p-2 bg-red-100 rounded-lg m-5 text-sm w-80`} value={searchBar} onChangeText={setSearchBar}/>
    </View>
    {searchData ? //list shown in the main page and checks if searching for something (has to be exact title or won't display)
      <MasonryList
        style={tw`px-0.5 pt-0.5 pb-20`}
        data={searchData.filter(note => note.title.includes(searchBar))}
        numColumns={2} 
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />  
      : <></> //button to add note, navigates straight to edit when clicked and a search bar that filters out notes not being searched
    } 
      <View style={tw`flex-row items-center`} > 
        <TouchableOpacity style = {tw`bg-red-100 p-4 m-5 rounded-full `} onPress = {() => {addNote({title: "", content: ""})}}>
        <Text style = {tw`text-5 font-bold text-center `}>+</Text>
        </TouchableOpacity>
        </View>
    </View> 
    
  );
}
//function: functions within the screen for editing such as being able to change content and title, as well as saving and deletion.
function EditScreen({ route, navigation }) {
  //variables used from dependencies
  const [title, setTitle] = useState(route.params.data.title);
  const [content, setContent] = useState(route.params.data.content)
  const [saveNote, {}] = useUpdateNoteMutation(); 
  const [deleteNote] = useDeleteNoteMutation();

   //to be called when trash button is pressed
   const pressedDelete = () => {
    deleteNote({id: route.params.data.id}); 
    navigation.goBack();
    console.log("Pressed Delete");
  }
  useLayoutEffect(() => { //set the title of the navigation when typed and the header to have a delete button
    navigation.setOptions({ title: route.params.data.title, 
    headerRight: () => (  <TouchableOpacity style = {tw`bg-red-100 p-1 m-3 rounded-lg `} onPress = {() => pressedDelete()} >
      <View style = {tw`w-6 h-6`}>
      <Image style={[tw`flex-1`]} source={{uri: "https://static-00.iconduck.com/assets.00/trash-icon-474x512-o7g8kfah.png"}} />
      </View>
      </TouchableOpacity>)});
  }, []);
  //automatically save when a change is done
  useEffect(() => {
    const saveNoteData = () => {
      saveNote({
        id: route.params.data.id,
        title,
        content,
      });
    };
    saveNoteData();

    return;
  }, [title, content, saveNote, navigation, route.params.data.id]);
 
  //show title and content, and when changed, there are 2 buttons as to save or delete
  return (
    
    <View style={tw`flex-1 items-center bg-red-400 p-2`}>
      {/*bar where you type title*/}
      <TextInput placeholder = "Please enter title" style = {tw`bg-red-200 p-2 m-2 w-full rounded-lg`} value = {title} onChangeText={setTitle}/>
      {/*content to be typed*/}
      <TextInput placeholder = "Please enter text" style = {tw` bg-red-200 p-2 w-full rounded-lg`} value = {content} onChangeText={setContent} multiline={true}/>
      {/*saves title and content when you leave*/}
    </View>
  );
  
}

const Stack = createNativeStackNavigator();
//default function where i can navigate through the main screen and note screen
export default function MyNotes() {
  return (
    //prop store added
    <Provider store={store}> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen //main screen, this is where you start when you open the app or go back through edit screen 
            options={{
              headerStyle: tw`bg-red-500 border-0`,
              headerTintColor: '#fff',
              headerTitleStyle: tw`font-bold`, 
              headerShadowVisible: false, 
            }}
            name="My Notes"
            component={MainNotes}
          />
          <Stack.Screen //navigates to edit screen when add note is pressed
            options={{
              headerStyle: tw`bg-red-500 border-0`, 
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


