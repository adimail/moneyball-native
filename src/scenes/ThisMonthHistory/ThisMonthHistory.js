import React, { useEffect, useContext, useState, useMemo } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { colors, fontSize } from 'theme'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { UserDataContext } from '../../context/UserDataContext'
import { useNavigation } from '@react-navigation/native'
import CustomSwitch from '../../components/toggleSwitch'
import { collection, getDocs } from 'firebase/firestore'
import { firestore } from '../../firebase/config'
import Log from '../../components/log'
import Card from '../../components/expenseCard'
import { showToast } from '../../utils/ShowToast'
import IconButton from '../../components/IconButton'

export default function ThisMonthHistory() {
  const navigation = useNavigation()
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    text: isDark ? colors.white : colors.primaryText,
  }
  const [type, setType] = useState('Expenditure')
  const [expenseData, setExpenseData] = useState(null)
  const [incomeData, setIncomeData] = useState(null)

  const CurrentMonth = new Date().toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  })

  const fetchDataForCurrentMonth = async () => {
    try {
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
    }
  }

  useEffect(() => {
    fetchDataForCurrentMonth()
  }, [])

  const onSelectSwitch = (value) => {
    setType(value)
  }

  const dataToDisplay = useMemo(() => {
    return type === 'Expenditure' ? expenseData : incomeData
  }, [type, expenseData, incomeData])

  return (
    <ScreenTemplate>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
      >
        <CustomSwitch
          selectionMode={1}
          roundCorner={true}
          option1={'Expenditure'}
          option2={'Income'}
          onSelectSwitch={onSelectSwitch}
          selectionColor={'#1C2833'}
        />
        <View style={styles.content}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <Button
              label={'Refresh'}
              color={colors.primary}
              onPress={() => {
                fetchDataForCurrentMonth()
              }}
            />

            <View style={[styles.separator]} />

            <View style={styles.logBook}>
              {dataToDisplay &&
                dataToDisplay.map((log) => (
                  <View style={styles.log} key={log.id}>
                    <View style={styles.column}>
                      <Text style={styles.title}>{log.title}</Text>
                      <Text style={styles.date}>
                        {new Date(log.date.seconds * 1000).toLocaleDateString()}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'center',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Text style={styles.amount}>₹ {log.amount}</Text>
                      <IconButton
                        icon="trash"
                        color={colors.white}
                        size={15}
                        // onPress={() => headerButtonPress()}
                        containerStyle={{ paddingRight: 15 }}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </View>
        </View>
        <View style={[styles.separator]} />
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
  },
  amount: {
    fontSize: 20,
    color: 'white',
  },
  title: {
    color: 'white',
    fontSize: 18,
  },
  date: {
    color: 'white',
    fontSize: 11,
  },
  log: {
    display: 'flex',
    borderRadius: 9,
    paddingVertical: 9,
    paddingLeft: 15,
    width: '87%',
    height: 68,
    backgroundColor: colors.primaryText,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    height: 10,
    width: '80%',
    alignSelf: 'center',
  },
  column: {
    justifyContent: 'space-between',
  },
})
