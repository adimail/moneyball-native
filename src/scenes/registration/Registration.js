import React, { useState, useContext, useEffect } from 'react'
import { Text, StyleSheet, View, Linking, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ScreenTemplate from '../../components/ScreenTemplate'
import TextInputBox from '../../components/TextInputBox'
import Button from '../../components/Button'
import Logo from '../../components/Logo'
import { firestore } from '../../firebase/config'
import { setDoc, doc } from 'firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { defaultAvatar } from '../../config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import IconButton from '../../components/IconButton'

export default function Registration() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  const openAndroidLink = () => {
    Linking.openURL(
      'https://drive.google.com/drive/folders/1Ghb0r-gG7VcAaMwBQXA6KrrJSTTtHFTL?usp=sharing',
    )
  }

  useEffect(() => {
    console.log('Registration screen')
  }, [])

  const onFooterLinkPress = () => {
    navigation.navigate('Login')
  }

  const onRegisterPress = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }
    try {
      setSpinner(true)
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const uid = response.user.uid
      const data = {
        id: uid,
        email,
        fullName,
        avatar: defaultAvatar,
        expenditure: [
          'College',
          'food',
          'Dmart',
          'Travel',
          'Electronics',
          'Internet',
          'Other',
        ],
        income: ['Parents', 'Internship', 'Stocks'],
        quickadd: [
          { title: 'Metro', category: 'Metro', amounts: ['21', '7', '12'] },
          {
            title: 'Canteen',
            category: 'College',
            amounts: ['20', '25', '60'],
          },
          { title: 'Tea', category: 'Food', amounts: ['12', '24', '15'] },
        ],
        joined: new Date(),
      }
      const usersRef = doc(firestore, 'users', uid)
      await setDoc(usersRef, data)
    } catch (e) {
      setSpinner(false)
      alert(e)
    }
  }

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <Logo />
          <View style={styles.input}>
            <TextInputBox
              placeholder="Your Name"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              autoCapitalize="none"
            />
            <TextInputBox
              placeholder="E-mail"
              onChangeText={(text) => setEmail(text)}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInputBox
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              autoCapitalize="none"
            />
            <TextInputBox
              secureTextEntry={true}
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              autoCapitalize="none"
            />
            <Button
              label="Agree and Create account"
              color={colors.primary}
              onPress={() => onRegisterPress()}
            />
            <View style={styles.footerView}>
              <Text style={[styles.footerText, { color: colorScheme.text }]}>
                Already got an account?{' '}
                <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                  Log in
                </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={openAndroidLink}
            style={{ alignItems: 'center', marginTop: 30, marginBottom: 30 }}
          >
            <IconButton
              icon="android"
              color="#3DDC84"
              size={20}
              containerStyle={{ paddingRight: 9 }}
            />
            <Text style={[styles.footerText, { color: colorScheme.text }]}>
              Android Apk
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      <Spinner
        visible={spinner}
        textStyle={{ color: colors.white }}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: fontSize.large,
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
  link: {
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 500,
  },
})
