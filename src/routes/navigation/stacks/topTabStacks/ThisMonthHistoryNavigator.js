import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import ThisMonthHistory from '../../../../scenes/ThisMonthHistory'

const Stack = createStackNavigator()

export const ThisMonthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
      })}
    >
      <Stack.Screen name="ThisMonthHistory" component={ThisMonthHistory} />
    </Stack.Navigator>
  )
}
