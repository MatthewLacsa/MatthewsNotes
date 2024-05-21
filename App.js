import { SafeAreaView, Text, FlatList, View } from 'react-native';
import tw, { useDeviceContext } from 'twrnc';
import { Provider } from 'react-redux';
import { store } from './store';
import 'react-native-reanimated'; 

const generateData = (count) => Array.from({ length: count }, (_, i) => ({ id: (i + 1).toString() }));

const data = generateData(20)

const Card = ({ item }) => {
  return (
    <View style={[tw`w-full h-12 mb-1 mr-1 rounded-lg p-4 bg-purple-400`]}>
      <Text>{ item.id }</Text>
    </View>
  );
};

const App = () => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Card item={item} />}
      numColumns={1}
      contentContainerStyle={tw`p-4`}
    />
  );
};

export default App;


