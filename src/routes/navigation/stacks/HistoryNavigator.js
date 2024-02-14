import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { UserDataContext } from '../../../context/UserDataContext'

import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'
import HeaderRightButton from '../../../components/HeaderRightButton'

import { HistoryNavigatorTabs } from '../toptabs/HistoryNavigatorTabs'
import IconButton from '../../../components/IconButton'
import { colors } from '../../../theme'
import { useNavigation } from '@react-navigation/native'

import { MaterialIcons } from '@expo/vector-icons'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const HistoryNavigator = () => {
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)
  const navigationProps = scheme === 'dark' ? darkProps : lightProps

  // const headerButtonPress = () => {
  //   navigation.navigate('ModalStacks', {
  //     screen: 'Post',
  //     params: {
  //       data: userData,
  //       from: 'Home screen',
  //     },
  //   })
  // }

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="History"
          component={HistoryNavigatorTabs}
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  )
}
