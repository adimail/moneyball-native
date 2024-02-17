import React, { useState, useContext, useEffect } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { firestore } from '../../firebase/config'
import { doc } from 'firebase/firestore'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { colors, fontSize } from '../../theme'
import { useNavigation } from '@react-navigation/native'

export default function AllTimeHistory() {
  const { userData, setUserData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation()

  const [monthsSinceJoined, setMonthsSinceJoined] = useState([])
  const joinedDate = userData.joined.toDate()
  const currentDate = new Date()

  const navigatetomonth = (monthName) => {
    navigation.navigate('ModalStacks', {
      screen: 'Month',
      params: {
        month: monthName,
        userData: userData,
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

    setMonthsSinceJoined(months.reverse())
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
        style={[styles.main, { paddingTop: 20 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
          All time history
        </Text>
        <View>
          <View style={styles.history}>
            {monthsSinceJoined.map((month, index) => (
              <TouchableOpacity
                onPress={() => navigatetomonth(month)}
                key={index}
                style={styles.monthcard}
              >
                <Text style={[styles.title]}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    fontSize: fontSize.xLarge,
    textAlign: 'center',
    color: 'white',
    backgroundColor: colors.primaryText,
    width: '100%',
    paddingVertical: 4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  history: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 10,
  },
  monthcard: {
    backgroundColor: colors.lightPurple,
    width: '30%',
    maxWidth: 200,
    height: 100,
    margin: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.gray,
  },
})
