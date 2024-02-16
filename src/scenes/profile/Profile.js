import React, { useState, useContext, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native'
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
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
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
            console.log('user deleted')
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
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Avatar size="xlarge" rounded source={{ uri: userData.avatar }} />
        </View>
        <Text style={[styles.field, { color: colorScheme.text }]}>Name:</Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {userData.fullName}
        </Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {userData.email}
        </Text>
        <Text style={[styles.title, { color: colorScheme.text }]}>
          {'Joined: ' +
            (joinedDate &&
              joinedDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }))}
        </Text>

        <Button label="Edit" color={colors.primary} onPress={goDetail} />
        <Button
          label="Delete account"
          color={colors.secondary}
          onPress={accountDelete}
        />
        <View style={styles.footerView}>
          <Text onPress={onSignOutPress} style={styles.footerLink}>
            Sign out
          </Text>
        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  avatar: {
    margin: 30,
    alignSelf: 'center',
    borderWidth: 7,
    borderColor: 'gray',
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
