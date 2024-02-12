import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { screenOptions } from './navigationProps/navigationProps'

import { ThisMonthNavigator } from '../stacks/topTabStacks/ThisMonthHistoryNavigator'
import { AllTimeHistoryNavigator } from '../stacks/topTabStacks/AllTimeHistoryNavigator'

const Tab = createMaterialTopTabNavigator()

export const HistoryNavigatorTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="ThisMonthNavigatorTab"
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="ThisMonthNavigatorTab"
        component={ThisMonthNavigator}
        options={{ tabBarLabel: 'This Month' }}
      />
      <Tab.Screen
        name="AllTimeHistoryTab"
        component={AllTimeHistoryNavigator}
        options={{ tabBarLabel: 'All Time' }}
      />
    </Tab.Navigator>
  )
}
