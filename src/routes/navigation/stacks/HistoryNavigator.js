import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ColorSchemeContext } from '../../../context/ColorSchemeContext'
import { UserDataContext } from '../../../context/UserDataContext'

import { lightProps, darkProps } from './navigationProps/navigationProps'
import HeaderStyle from './headerComponents/HeaderStyle'
import HeaderRightButton from '../../../components/HeaderRightButton'

import { FollowFollowerNavigator } from '../toptabs/followfollowerNavigator'
import IconButton from '../../../components/IconButton'
import { colors } from '../../../theme'
import { useNavigation } from '@react-navigation/native'

const Stack = createStackNavigator()
const RootStack = createStackNavigator()

export const HistoryNavigator = () => {
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const { userData } = useContext(UserDataContext)
  const navigationProps = scheme === 'dark' ? darkProps : lightProps

  const headerButtonPress = () => {
    navigation.navigate('ModalStacks', {
      screen: 'Post',
      params: {
        data: userData,
        from: 'Home screen',
      },
    })
  }

  return (
    <Stack.Navigator screenOptions={navigationProps}>
      <RootStack.Group>
        <Stack.Screen
          name="History"
          component={FollowFollowerNavigator}
          options={({ navigation }) => ({
            headerBackground: scheme === 'dark' ? null : () => <HeaderStyle />,
            headerRight: () => (
              <IconButton
                icon="box-open"
                color={colors.lightPurple}
                size={24}
                onPress={() => headerButtonPress()}
                containerStyle={{ paddingRight: 15 }}
              />
            ),
          })}
        />
      </RootStack.Group>
    </Stack.Navigator>
  )
}
