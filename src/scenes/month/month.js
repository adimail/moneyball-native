import React, { useEffect, useContext, useState, useMemo } from 'react'
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import CustomSwitch from '../../components/toggleSwitch'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import Log from '../../components/log'
import Card from '../../components/expenseCard'
import { showToast } from '../../utils/ShowToast'
import IconButton from '../../components/IconButton'
import { useFocusEffect } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { HomeTitleContext } from '../../context/HomeTitleContext'

export default function Month({ route }) {
  const { month, userData } = route.params
  const { scheme } = useContext(ColorSchemeContext)
  const { setTitle } = useContext(HomeTitleContext)
  const isDark = scheme === 'dark'
  const textColor = isDark ? 'white' : 'black'

  const [type, setType] = useState('Expenditure')
  const [expenseData, setExpenseData] = useState(null)
  const [incomeData, setIncomeData] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useFocusEffect(() => {
    setTitle(`${month} History`)
  })

  const CurrentMonth = month

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  const fetchSummaryData = async (dataType) => {
    try {
      const summaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        dataType,
        CurrentMonth,
        'Aggregate',
      )
      const summarySnapshot = await getDoc(summaryRef)
      if (summarySnapshot.exists()) {
        const summaryData = summarySnapshot.data()
        if (dataType === 'Expenditure') {
          setTotalExpense(summaryData.sum || 0)
        } else if (dataType === 'Income') {
          setTotalIncome(summaryData.sum || 0)
        }
      }
    } catch (error) {
      console.error('Error fetching summary data:', error)
    }
  }

  const fetchDataForCurrentMonth = async () => {
    try {
      setIsRefreshing(true)

      const expenseCollectionRef = collection(
        firestore,
        `transactions-${userData.id}`,
        'Expenditure',
        CurrentMonth,
      )
      const incomeCollectionRef = collection(
        firestore,
        `transactions-${userData.id}`,
        'Income',
        CurrentMonth,
      )

      const [expenseSnapshot, incomeSnapshot] = await Promise.all([
        getDocs(expenseCollectionRef),
        getDocs(incomeCollectionRef),
      ])

      const expenses = expenseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      const incomes = incomeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setExpenseData(expenses)
      setIncomeData(incomes)

      const currentDate = new Date()
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })

      const formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })

      showToast({
        title: 'Data refreshed',
        body: `Last Updated: ${formattedDate} ${formattedTime}`,
        isDark: isDark,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDataForCurrentMonth()
    fetchSummaryData('Expenditure')
    fetchSummaryData('Income')
  }, [])

  const onSelectSwitch = (value) => {
    setType(value)
  }

  const deleteLog = async () => {
    try {
      const transactionRef = doc(
        firestore,
        `transactions-${userData.id}/${type}/${CurrentMonth}`,
        selectedLog.id,
      )
      const transactionSnapshot = await getDoc(transactionRef)
      const transactionData = transactionSnapshot.data()
      const amountToDelete = transactionData.amount

      const summaryRef = doc(
        firestore,
        `summaries-${userData.id}`,
        type,
        CurrentMonth,
        'Aggregate',
      )
      const summarySnapshot = await getDoc(summaryRef)
      if (summarySnapshot.exists()) {
        const summaryData = summarySnapshot.data()
        const currentSum = summaryData.sum || 0
        const updatedSum = currentSum - amountToDelete
        await setDoc(summaryRef, { sum: updatedSum })
      }

      await deleteDoc(transactionRef)

      showToast({
        title: 'Log Deleted. Refresh to view changes',
        isDark,
      })
    } catch (error) {
      console.error('Error deleting log:', error)
    }
  }

  const confirmDeleteLog = (log) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this log?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: () => deleteLog() },
      ],
      { cancelable: false },
    )
  }

  const dataToDisplay = useMemo(() => {
    return type === 'Expenditure' ? expenseData : incomeData
  }, [type, expenseData, incomeData])

  const onRefresh = () => {
    setIsRefreshing(true)

    fetchDataForCurrentMonth()
    fetchSummaryData('Expenditure')
    fetchSummaryData('Income')

    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  return (
    <ScreenTemplate>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <CustomSwitch
          selectionMode={1}
          roundCorner={true}
          options={['Expenditure', 'Income']}
          onSelectSwitch={onSelectSwitch}
          selectionColor={'#1C2833'}
        />

        <Card
          title={`${CurrentMonth} aggregate`}
          amount={type === 'Income' ? totalIncome : totalExpense}
        />

        <View style={styles.content}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <View
              style={[
                styles.separator,
                {
                  backgroundColor: isDark ? 'white' : 'black',
                },
              ]}
            />

            <View style={styles.logBook}>
              {dataToDisplay &&
                (dataToDisplay.length === 0 ? (
                  <Text
                    style={[
                      styles.title,
                      { color: isDark ? 'white' : 'black' },
                    ]}
                  >
                    No data to display
                  </Text>
                ) : (
                  dataToDisplay.map((log) => (
                    <TouchableOpacity
                      style={styles.log}
                      key={log.id}
                      onPress={() => {
                        setSelectedLog(log)
                        confirmDeleteLog(log)
                      }}
                    >
                      <View style={styles.column}>
                        <Text style={[styles.title]} numberOfLines={1}>
                          {log.title}
                        </Text>
                        <Text style={styles.date}>
                          {new Date(log.date.seconds * 1000).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: '2-digit',
                              weekday: 'short',
                            },
                          )}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.amount}>₹ {log.amount}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ))}
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  logBook: {
    width: '100%',
    maxWidth: 1000,
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    gap: 9,
  },
  amount: {
    fontSize: 20,
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: 18,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  date: {
    color: 'white',
    fontSize: 11,
  },
  log: {
    display: 'flex',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 20,
    width: '87%',
    height: 40,
    backgroundColor: colors.primaryText,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.3,
    borderColor: 'white',
  },
  switchContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  column: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
