import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Password from './routes/Password';
import Splash from './routes/Splash';
import LoadProduct from './routes/LoadProduct';
import ListProducts from './routes/ListProducts';
import Homepage from './routes/Homepage';
import CreateProduct from './routes/CreateProduct';

const App = () => {
  
  const Stack = createNativeStackNavigator();

  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
<Stack.Screen name='Home' options={{ title: 'Home' }}>
  {(props) => <HomeScreen {...props} otherProp={otherProp} />}
</Stack.Screen>
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Splash" component={Splash} />
        <Stack.Screen options={{headerShown: false}} name="Password" component={Password} />
        <Stack.Screen options={{headerShown: false}} name="LoadProduct">
          {(props) => <LoadProduct {...props} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} /> }
        </Stack.Screen>
        <Stack.Screen options={{headerShown: false}} name="ListProducts" >
          {(props) => <ListProducts {...props} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} /> }
        </Stack.Screen>
        <Stack.Screen options={{headerShown: false}} name="Homepage">
          {(props) => <Homepage {...props} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} /> }
        </Stack.Screen>
        <Stack.Screen options={{headerShown: false}} name="CreateProduct">
          {(props) => <CreateProduct {...props} isBurgerMenuOpen={isBurgerMenuOpen} setBurgerMenuOpen={setBurgerMenuOpen} /> }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>    
  );
}

export default App
