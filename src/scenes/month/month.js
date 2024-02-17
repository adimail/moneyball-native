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
import CustomSwitch from '../../components/toggleSwitch'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import Log from '../../components/log'
import Card from '../../components/expenseCard'
import { showToast } from '../../utils/ShowToast'
import { Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function Month({ route }) {
  const { month, userData } = route.params
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [type, setType] = useState('Expenditure')
  const [expenseData, setExpenseData] = useState(null)
  const [incomeData, setIncomeData] = useState(null)
  const [selectedLog, setSelectedLog] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [filter, setFilter] = useState('Date')
  const [categoryfilter, setCategoryFilter] = useState('All')

  const [incomeCategories, setIncomeCategories] = useState(['All'])
  const [expenseCategories, setExpenseCategories] = useState(['All'])
  const [showfilters, setShowFilters] = useState(false)
  const [order, setOrder] = useState('desc')

  const [isLoading, setIsLoading] = useState(false)

  const CurrentMonth = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })

  const [totalExpense, setTotalExpense] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    if (incomeData) {
      const uniqueIncomeCategories = extractUniqueCategories(incomeData)
      setIncomeCategories(['All', ...uniqueIncomeCategories])
    }
    if (expenseData) {
      const uniqueExpenseCategories = extractUniqueCategories(expenseData)
      setExpenseCategories(['All', ...uniqueExpenseCategories])
    }
  }, [incomeData, expenseData])

  const extractUniqueCategories = (logs) => {
    const categories = logs.reduce((uniqueCategories, log) => {
      if (!uniqueCategories.includes(log.category)) {
        return [...uniqueCategories, log.category]
      }
      return uniqueCategories
    }, [])
    return categories
  }

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

  const onSelectFilter = (value) => {
    setFilter(value)
  }
  const onSelectCategoryFilter = (value) => {
    setCategoryFilter(value)
  }

  const deleteLog = async () => {
    try {
      const batch = writeBatch(firestore)

      // Delete transaction directly without fetching it
      const transactionRef = doc(
        firestore,
        `transactions-${userData.id}/${type}/${CurrentMonth}`,
        selectedLog.id,
      )
      batch.delete(transactionRef)

      // Update summary by subtracting the amount of the deleted log
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
        const updatedSum = currentSum - selectedLog.amount
        batch.update(summaryRef, { sum: updatedSum })
      }

      await batch.commit()

      showToast({
        title: 'Log Deleted',
        isDark,
      })

      fetchDataForCurrentMonth()
      fetchSummaryData('Expenditure')
      fetchSummaryData('Income')
    } catch (error) {
      console.error('Error deleting log:', error)
    }
  }

  const confirmDeleteLog = (log) => {
    if (Platform.OS === 'web') {
      alert('Use mobile application to delete your account')
      return
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this log?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'OK', onPress: deleteLog },
      ],
      { cancelable: false },
    )
  }

  const dataToDisplay = useMemo(() => {
    let filteredData = []

    if (type === 'Expenditure' && expenseData) {
      filteredData = [...expenseData]
    } else if (type === 'Income' && incomeData) {
      filteredData = [...incomeData]
    }

    // Apply filter based on selected filter type
    if (filter === 'Date') {
      // Sort by date
      filteredData = filteredData.sort((a, b) => {
        if (order === 'asc') {
          return (
            new Date(a.date.seconds * 1000) - new Date(b.date.seconds * 1000)
          )
        } else {
          return (
            new Date(b.date.seconds * 1000) - new Date(a.date.seconds * 1000)
          )
        }
      })
    } else if (filter === 'Amount') {
      // Sort by amount
      filteredData = filteredData.sort((a, b) => {
        if (order === 'asc') {
          return a.amount - b.amount
        } else {
          return b.amount - a.amount
        }
      })
    }

    // Apply category filter
    if (categoryfilter !== 'All') {
      filteredData = filteredData.filter(
        (log) => log.category === categoryfilter,
      )
    }

    return filteredData
  }, [type, expenseData, incomeData, filter, categoryfilter, order])

  const onRefresh = () => {
    setIsRefreshing(true)
    setIsLoading(true)

    fetchDataForCurrentMonth()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))

    fetchSummaryData('Expenditure')
    fetchSummaryData('Income')

    setTimeout(() => {
      setIsRefreshing(false)
    }, 2000)
  }

  useEffect(() => {
    if (selectedLog !== null) {
      confirmDeleteLog(selectedLog)
    }
  }, [selectedLog])

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            alignItems: 'center',
            paddingBottom: 10,
            width: 300,
            alignSelf: 'center',
          }}
        >
          <CustomSwitch
            selectionMode={1}
            roundCorner={true}
            options={['Expenditure', 'Income']}
            onSelectSwitch={onSelectSwitch}
            selectionColor={'#1C2833'}
          />
        </View>

        <Card
          title={`${CurrentMonth} ${type === 'Income' ? 'Income' : 'Expenses'}`}
          amount={type === 'Income' ? totalIncome : totalExpense}
        />
        <Card
          title={`Income - Expenditure`}
          amount={totalIncome - totalExpense}
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

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 30,
                maxWidth: 300,
                marginTop: 10,
                alignItems: 'center',
              }}
            >
              <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                <MaterialCommunityIcons
                  name="sort-alphabetical-ascending"
                  size={35}
                  color={order === 'asc' ? colors.primary : colors.gray}
                  onPress={() => {
                    setOrder('asc')
                  }}
                />
                <MaterialCommunityIcons
                  name="sort-alphabetical-descending"
                  size={35}
                  color={order === 'desc' ? colors.primary : colors.gray}
                  onPress={() => {
                    setOrder('desc')
                  }}
                />
              </View>
            </View>

            <Text style={{ color: isDark ? 'white' : 'black' }}>
              Filter by Date, Costs and categories of logs
            </Text>

            <ScrollView
              horizontal={true}
              contentContainerStyle={styles.scrollViewContainer}
              showsVerticalScrollIndicator={false}
            >
              <CustomSwitch
                selectionMode={1}
                roundCorner={true}
                options={['Date', 'Amount']}
                onSelectSwitch={onSelectFilter}
                selectionColor={'#1C2833'}
                height={38}
                borderRadius={10}
              />
              <CustomSwitch
                selectionMode={1}
                roundCorner={true}
                options={
                  type === 'Income' ? incomeCategories : expenseCategories
                }
                onSelectSwitch={onSelectCategoryFilter}
                selectionColor={'#1C2833'}
                height={36}
                borderRadius={10}
              />
            </ScrollView>

            <View style={styles.logBook}>
              {isLoading ? ( // Check if loading
                <Text
                  style={[styles.title, { color: isDark ? 'white' : 'black' }]}
                >
                  Fetching data from cloud ☁️
                </Text>
              ) : (
                dataToDisplay && (
                  <>
                    {dataToDisplay.length === 0 ? (
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
                          style={[
                            styles.log,
                            {
                              backgroundColor: isDark
                                ? colors.primaryText
                                : colors.primary,
                            },
                          ]}
                          key={log.id}
                          onLongPress={() => setSelectedLog(log)}
                        >
                          <View style={styles.column}>
                            <Text style={[styles.title]} numberOfLines={1}>
                              {log.title}
                            </Text>
                            <Text style={styles.date}>
                              {new Date(
                                log.date.seconds * 1000,
                              ).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                weekday: 'short',
                              })}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.amount}>₹ {log.amount}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </>
                )
              )}
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: 100,
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
    marginTop: 20,
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
  scrollViewContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
})
