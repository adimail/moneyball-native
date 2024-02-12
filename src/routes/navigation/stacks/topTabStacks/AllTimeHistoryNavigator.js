import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AllTimeHistory from '../../../../scenes/AllTimeHistory'

const Stack = createStackNavigator()

export const AllTimeHistoryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="AllTimeHistory" component={AllTimeHistory} />
    </Stack.Navigator>
  )
}
