import React, { useEffect, useContext, useState, useMemo } from 'react'
import { Text, View, StyleSheet } from 'react-native'
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

export default function Follow() {
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

      showToast('Data refreshed', isDark)
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
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{ width: '100%' }}>
            <Button
              label={'Refresh'}
              color={colors.primary}
              onPress={() => {
                fetchDataForCurrentMonth()
              }}
            />

            <View style={styles.logBook}>
              {dataToDisplay &&
                dataToDisplay.map((log) => (
                  <View style={styles.log} key={log.id}>
                    <View>
                      <Text style={styles.title}>{log.title}</Text>
                      <Text style={styles.date}>{log.date}</Text>
                    </View>
                    <Text style={styles.amount}>₹ {log.amount}</Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
        <View style={styles.switchContainer}>
          <CustomSwitch
            selectionMode={1}
            roundCorner={true}
            option1={'Expenditure'}
            option2={'Income'}
            onSelectSwitch={onSelectSwitch}
            selectionColor={'#1C2833'}
          />
        </View>
      </View>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'top',
    width: '100%',
    marginTop: 30,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  logBook: {
    width: '100%',
    alignItems: 'center',
    display: 'flex',
    gap: 9,
  },
  amount: {
    fontSize: 21,
  },
  title: {
    fontSize: 18,
  },
  date: {
    fontSize: 12,
  },
  log: {
    display: 'flex',
    borderRadius: 9,
    paddingVertical: 9,
    paddingHorizontal: 10,
    width: '90%',
    backgroundColor: '#B7950B',
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
})
