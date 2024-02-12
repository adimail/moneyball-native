import React, { useEffect, useContext, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import CustomSwitch from '../../components/toggleSwitch'

export default function Follow() {
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [type, setType] = useState('Expenditure')

  const onSelectSwitch = (value) => {
    setType(value)
    console.log(value)
  }

  useEffect(() => {
    console.log('Follow screen')
  }, [])

  return (
    <ScreenTemplate>
      <View style={[styles.container]}>
        <View style={{ width: '100%' }}>
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              option1={'Expenditure'}
              option2={'Income'}
              onSelectSwitch={onSelectSwitch}
              selectionColor={'#1C2833'}
            />
          </View>
          {/* <Button
            label="Open Modal"
            color={colors.tertiary}
            onPress={() => {
              navigation.navigate('ModalStacks', {
                screen: 'Post',
                params: {
                  data: userData,
                  from: 'Follow screen',
                },
              })
            }}
          /> */}
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'top',
    width: '100%',
    marginTop: 30,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
})
