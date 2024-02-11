import React, { useEffect, useContext, useState } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import Button from '../../components/Button'
import { showToast } from '../../utils/ShowToast'
import ShowSnackbar from '../../components/ShowSnackbar'
import CustomSwitch from '../../components/toggleSwitch'

export default function Follower() {
  const { scheme } = useContext(ColorSchemeContext)
  const [visible, setVisible] = useState(false)
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
    console.log('Follower screen')
  }, [])

  const onDismissSnackBar = () => setVisible(false)

  const onShowToastPress = () => {
    showToast({
      title: 'Hello',
      body: 'This is some something 👋',
      isDark,
    })
  }

  const onShowSnackbarPress = () => {
    setVisible(true)
  }

  return (
    <>
      <ScreenTemplate>
        <View style={styles.container}>
          <View style={{ width: '100%' }}>
            <View style={{ alignItems: 'center', paddingBottom: 10 }}>
              <CustomSwitch
                selectionMode={1}
                roundCorner={true}
                option1={'Expenditure'}
                option2={'Saving'}
                onSelectSwitch={onSelectSwitch}
                selectionColor={'#1C2833'}
              />
            </View>
            {/* <Button
              label="Show Toast"
              color={colors.lightPurple}
              onPress={onShowToastPress}
            />
            <Button
              label="Show Snackbar"
              color={colors.purple}
              onPress={onShowSnackbarPress}
            /> */}
          </View>
        </View>
      </ScreenTemplate>
      <ShowSnackbar
        visible={visible}
        onDismissSnackBar={onDismissSnackBar}
        title="Hello 👋"
        duration={3000}
      />
    </>
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
