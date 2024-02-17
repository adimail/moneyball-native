import React, { useState, useContext, useEffect, useLayoutEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
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

  const onSignOutPress = () => {
    signOut(auth)
      .then(async () => {
        await Restart()
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const accountDelete = async () => {
    if (Platform.OS === 'web') {
      alert('Use mobile application to delete your account')
      return
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all you data will be lost',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => confirmAccountDeletion() },
      ],
      { cancelable: false },
    )
  }

  const confirmAccountDeletion = async () => {
    const tokensDocumentRef = doc(firestore, 'tokens', userData.id)
    const usersDocumentRef = doc(firestore, 'users', userData.id)

    await deleteDoc(tokensDocumentRef)
    await deleteDoc(usersDocumentRef)

    const user = auth.currentUser
    deleteUser(user)
      .then(() => {
        signOut(auth)
          .then(() => {
            console.log('User deleted')
          })
          .catch((error) => {
            console.log(error.message)
          })
      })
      .catch((error) => {
        console.log(error)
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

          <View style={{ marginTop: 20 }}>
            <Button label="Edit" color={colors.primary} onPress={goDetail} />
            <Button label="How to use Moneyball" color={colors.primary} />
            <Button
              label="Delete account"
              color={colors.secondary}
              onPress={accountDelete}
            />
          </View>
          <View style={styles.footerView}>
            <Text onPress={onSignOutPress} style={styles.footerLink}>
              Sign out
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  top: {
    backgroundColor: colors.lightPurple,
    width: '100%',
    height: 111,
    position: 'absolute',
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
    marginBottom: 5,
    textAlign: 'left',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
    borderWidth: 3,
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
