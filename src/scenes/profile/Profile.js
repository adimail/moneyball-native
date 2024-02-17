import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Linking,
  TouchableOpacity,
} from 'react-native'
import { Avatar } from '@rneui/themed'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { doc, deleteDoc } from 'firebase/firestore'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import { colors, fontSize } from '../../theme'
import { signOut, deleteUser } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { Restart } from '../../utils/Restart'
import { MaterialIcons } from '@expo/vector-icons'
import IconButton from '../../components/IconButton'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FontAwesome6 } from '@expo/vector-icons'

export default function Profile() {
  const { userData, setUserData } = useContext(UserDataContext)
  const navigation = useNavigation()
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }

  const [monthsSinceJoined, setMonthsSinceJoined] = useState([])

  const joinedDate = userData.joined.toDate()
  const joinedDateMillis = userData.joined.toDate().getTime()

  const currentDate = new Date()
  const currentDateMillis = new Date().getTime()
  const differenceMillis = currentDateMillis - joinedDateMillis
  const monthsPassed = Math.floor(differenceMillis / (1000 * 60 * 60 * 24 * 30))

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10 }}>
          <IconButton
            icon="code"
            color={colors.lightPurple}
            size={23}
            onPress={() => ReaddeveloperInfo()}
            containerStyle={{ paddingRight: 9 }}
          />
        </View>
      ),
    })
  }, [navigation])

  const ReaddeveloperInfo = () => {
    // Alert.alert('Quick Add', 'Render Quick Add')
    navigation.navigate('ModalStacks', {
      screen: 'Developer',
      params: {
        data: userData,
        from: 'Home screen',
      },
    })
  }

  useEffect(() => {
    let currentMonth = new Date(joinedDate)
    const months = []

    while (currentMonth <= currentDate) {
      const formattedMonth = currentMonth.toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric',
      })

      months.push(formattedMonth)
      currentMonth.setMonth(currentMonth.getMonth() + 1)
    }

    setMonthsSinceJoined(months)
  }, [userData.joined])

  const goDetail = () => {
    navigation.navigate('Edit', { userData: userData })
  }

  const goToUserGuide = () => {
    navigation.navigate('UserGuide')
  }

  const openGithub = () => {
    Linking.openURL('https://github.com/adimail/moneyball-native')
  }

  const openWebLink = () => {
    Linking.openURL('https://moneyball-hub.web.app')
  }

  const openAndroidLink = () => {
    Linking.openURL(
      'https://drive.google.com/drive/folders/1Ghb0r-gG7VcAaMwBQXA6KrrJSTTtHFTL?usp=sharing',
    )
  }

  const openTwitter = () => {
    Linking.openURL('https://twitter.com/adityagodse381')
  }

  const onSignOutPress = () => {
    signOut(auth)
      .then(async () => {
        await Restart()
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.top}></View>

        <View style={styles.main}>
          <View style={styles.avatar}>
            <Avatar size="xlarge" rounded source={{ uri: userData.avatar }} />
          </View>
          <Text style={[styles.title, { color: colorScheme.text }]}>
            {userData.fullName}
          </Text>
          <Text style={[styles.subtitle, { color: colorScheme.text }]}>
            {userData.email}
          </Text>
          <Text style={[styles.subtitle, { color: colorScheme.text }]}>
            {'Joined: ' +
              (joinedDate &&
                joinedDate.toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }))}
          </Text>

          <View style={{ paddingVertical: 30 }}>
            <Button label="Edit" color={colors.primary} onPress={goDetail} />
            <Button
              label="how to use Moneyball"
              color={colors.primary}
              onPress={goToUserGuide}
            />
            <Button
              label="Sign out"
              color={colors.secondary}
              onPress={onSignOutPress}
            />
          </View>
          <Text
            style={[
              {
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: 20,
                fontSize: 15,
              },
            ]}
          >
            Moneyball is accessible on both Android and web platforms, with your
            data securely stored in the cloud, enabling you to access it from
            anywhere.
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://www.moneyball-hub.web.app')
            }}
          >
            <Text
              style={[
                {
                  color: '#6996ff',
                  textAlign: 'center',
                  marginBottom: 50,
                  fontSize: 15,
                },
              ]}
            >
              www.moneyball-hub.web.app
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              paddingHorizontal: 27,
              marginVertical: 10,
            }}
          >
            <IconButton
              icon="github"
              color={colorScheme.text}
              size={20}
              onPress={openGithub}
              containerStyle={{ paddingRight: 9 }}
            />
            <MaterialCommunityIcons
              name="web"
              size={20}
              color={colorScheme.text}
              onPress={openWebLink}
            />
            <IconButton
              icon="android"
              color="#3DDC84"
              size={20}
              onPress={openAndroidLink}
              containerStyle={{ paddingRight: 9 }}
            />
            <FontAwesome6
              name="x-twitter"
              size={20}
              color={colorScheme.text}
              onPress={openTwitter}
            />
          </View>
          <Text
            style={[
              {
                color: colorScheme.text,
                textAlign: 'center',
                marginBottom: 50,
              },
            ]}
          >
            Made with love by Aditya Godse
          </Text>
        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  top: {
    height: 111,
    backgroundColor: colors.lightPurple,
    position: 'absolute',
    width: '100%',
  },
  main: {
    flex: 1,
    width: 300,
    alignSelf: 'center',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 500,
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  footerLink: {
    color: colors.blueLight,
    fontWeight: 'bold',
    fontSize: fontSize.large,
  },
})
