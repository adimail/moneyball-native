import React, { useEffect, useContext, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { colors } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import { showToast } from '../../utils/ShowToast'

export default function AllTimeHistory() {
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [isRefreshing, setIsRefreshing] = useState(false)

  const joinedDate = new Date(userData.joined)

  const onRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      ></ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
})
