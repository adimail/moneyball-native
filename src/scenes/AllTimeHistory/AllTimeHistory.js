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
  const [incomeSummaries, setIncomeSummaries] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const joinedDate = new Date(userData.joined)
  const formattedDate = `${joinedDate.toLocaleString('default', {
    month: 'short',
  })} ${joinedDate.getFullYear()}`

  const onRefresh = () => {
    setIsRefreshing(true)
  }

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.summary, { color: colorScheme.text }]}>
          {formattedDate}
        </Text>
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  summary: {
    fontSize: 18,
    marginBottom: 10,
  },
})
