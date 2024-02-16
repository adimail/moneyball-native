import React, { useState, useContext, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { firestore } from '../../firebase/config'
import { doc } from 'firebase/firestore'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { colors, fontSize } from '../../theme'

export default function AllTimeHistory() {
  const { userData, setUserData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [refreshing, setRefreshing] = useState(false)

  const [monthsSinceJoined, setMonthsSinceJoined] = useState([])

  const joinedDate = userData.joined.toDate()
  const currentDate = new Date()

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

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text style={[styles.title, { color: colorScheme.text }]}>
            Months since joined:
          </Text>
          {monthsSinceJoined.map((month, index) => (
            <Text
              key={index}
              style={[styles.title, { color: colorScheme.text }]}
            >
              {month}
            </Text>
          ))}
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
