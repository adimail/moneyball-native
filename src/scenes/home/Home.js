import React, {
  useEffect,
  useState,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  Image,
  Alert,
  RefreshControl,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import {
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  setDoc,
  collection,
} from 'firebase/firestore'
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { getKilobyteSize } from '../../utils/functions'
import Card from '../../components/expenseCard'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import CustomSwitch from '../../components/toggleSwitch'
import { showToast } from '../../utils/ShowToast'
import QuickAddComponent from '../../utils/quickAdd'
import { MaterialIcons } from '@expo/vector-icons'
import { submitData } from '../../utils/SubmitUserData'

export default function Home() {
  const navigation = useNavigation()
  const [token, setToken] = useState('')
  const { userData } = useContext(UserDataContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    fetchSummaryData()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  // expense categories
  const ExpenditureData = userData && userData['expenditure']
  const SavingsDate = userData && userData['income']

  // Account Information
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState(null)
  const [date, setDate] = useState(new Date())
  const [type, setType] = useState('Expenditure')
  const [selected, setSelected] = React.useState('')
  const [category, setCategory] = useState('')

  const [CurrentMonthExpense, setCurrentMonthExpense] = useState(0)
  const [CurrentMonthIncome, setCurrentMonthIncome] = useState(0)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [isTodaySwitchOn, setIsTodaySwitchOn] = useState(
    date.toDateString() === new Date().toDateString(),
  )

  const isExpenditureDataEmpty = false
  const isSavingsDateEmpty = false

  const QuickAddData = userData && userData['quickadd']

  // const QuickAddData = [
  //   { title: 'Rickshaw', category: 'Rickshaw', amounts: ['20', '25', '10'] },
  //   { title: 'Metro', category: 'Metro', amounts: ['21', '7', '12'] },
  //   { title: 'Top Up', category: 'Accessories and Internet', amounts: ['19'] },
  // ]

  const MonthYear = useMemo(() => {
    return date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })
  }, [date])

  const handleCurrentMonthCardPress = () => {
    navigation.navigate('History')
  }

  const fetchSummaryData = async () => {
    const MonthYear = date.toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })

    const expenseSummaryRef = doc(
      firestore,
      `summaries-${userData.id}`,
      'Expenditure',
      MonthYear,
      'Aggregate',
    )

    const incomeSummaryRef = doc(
      firestore,
      `summaries-${userData.id}`,
      'Income',
      MonthYear,
      'Aggregate',
    )

    try {
      const [expenseDocSnapshot, incomeDocSnapshot] = await Promise.all([
        getDoc(expenseSummaryRef),
        getDoc(incomeSummaryRef),
      ])

      if (expenseDocSnapshot.exists()) {
        const expenseData = expenseDocSnapshot.data()
        setCurrentMonthExpense(expenseData.sum || 0)
      } else {
        setCurrentMonthExpense(0)
      }

      if (incomeDocSnapshot.exists()) {
        const incomeData = incomeDocSnapshot.data()
        setCurrentMonthIncome(incomeData.sum || 0)
      } else {
        setCurrentMonthIncome(0)
      }
    } catch (error) {
      console.error('Error fetching summary documents: ', error)
    }
  }

  useEffect(() => {
    fetchSummaryData()
  }, [])

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
      setIsTodaySwitchOn(
        selectedDate.toDateString() === new Date().toDateString(),
      )
      // const formattedDate = selectedDate.toLocaleDateString('en-GB', {
      //   day: 'numeric',
      //   month: 'short',
      // })
      // setTitle(`${selected} ${formattedDate}`)
    }
  }

  const renderDatePicker = () => {
    return (
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        maximumDate={new Date()}
        onChange={handleDateChange}
      />
    )
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ paddingRight: 10 }}>
          <MaterialIcons
            name="category"
            size={35}
            color="black"
            onPress={() => NavigateToCategories()}
            color={colors.lightPurple}
          />
        </View>
      ),
    })
  }, [navigation])

  const NavigateToCategories = () => {
    // Alert.alert('Quick Add', 'Render Quick Add')
    navigation.navigate('ModalStacks', {
      screen: 'Post',
      params: {
        data: userData,
        from: 'Home screen',
      },
    })
  }

  const NavigateToQuickAdd = () => {
    // Alert.alert('Quick Add', 'Render Quick Add')
    navigation.navigate('ModalStacks', {
      screen: 'QuickAdd',
      params: {
        data: userData,
        from: 'Home screen',
      },
    })
  }

  const handleCategorySelection = (value) => {
    setSelected(value)
    // const formattedDate = date.toLocaleDateString('en-GB', {
    //   day: 'numeric',
    //   month: 'short',
    // })
    // setTitle(`${value} ${formattedDate}`)
  }

  const handleSwitchToggle = (value) => {
    setIsTodaySwitchOn(value)
    if (value) {
      setDate(new Date())
      // const formattedDate = new Date().toLocaleDateString('en-GB', {
      //   day: 'numeric',
      //   month: 'short',
      // })
      // setTitle(`${selected} ${formattedDate}`)
    } else {
      // const formattedDate = date.toLocaleDateString('en-GB', {
      //   day: 'numeric',
      //   month: 'short',
      // })
      // setTitle(`${selected} ${formattedDate}`)
    }
  }

  React.useEffect(() => {
    if (!isTodaySwitchOn) {
      setShowDatePicker(true)
    }
  }, [isTodaySwitchOn])

  const HandleSubmitData = () => {
    if (title && selected && amount !== null) {
      submitData(
        type,
        title,
        amount,
        category,
        userData,
        date,
        setCurrentMonthExpense,
      )
        .then(() => {
          showToast({
            title: 'Log Added',
            body: title,
            isDark,
          })

          setAmount('')
          setTitle('')
          setDate(new Date())
          setIsTodaySwitchOn(true)
          setCategory('')
        })
        .catch((error) => {
          console.error('Error adding document: ', error)
          Alert.alert('Error', 'Failed to add log. Please try again.')
        })
    } else {
      alert('Please fill in all required fields')
    }
  }

  const onSelectSwitch = (value) => {
    setType(value)
  }

  return (
    <ScreenTemplate>
      <ScrollView
        style={styles.main}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        <View style={[styles.top]}>
          <TouchableOpacity
            style={styles.container}
            onPress={handleCurrentMonthCardPress}
          >
            <Card
              title="Current month aggregate"
              amount={
                type === 'Income' ? CurrentMonthIncome : CurrentMonthExpense
              }
            />
          </TouchableOpacity>

          <View style={[styles.separator]} />

          <Text style={[styles.text, { color: 'white' }]}>
            {'Date: ' +
              date.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
          </Text>

          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <CustomSwitch
              selectionMode={1}
              roundCorner={true}
              options={['Expenditure', 'Income']}
              onSelectSwitch={onSelectSwitch}
              selectionColor={'#1C2833'}
            />
          </View>

          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />

            <SelectList
              boxStyles={{
                height: 45,
                borderColor: '#BABABA',
                borderRadius: 50,
                backgroundColor: '#F2F3F4',
                width: 300,
                borderWidth: 1,
                paddingHorizontal: 10,
              }}
              dropdownTextStyles={{ fontSize: 14, color: 'white' }}
              dropdownStyles={{ backgroundColor: '#1c2833ba' }}
              setSelected={handleCategorySelection}
              search={false}
              data={type === 'Expenditure' ? ExpenditureData : SavingsDate}
              save="value"
              placeholder="Select Category"
            />

            <TextInput
              style={[styles.input]}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => setAmount(text)}
            />
            <View style={styles.inline}>
              <View style={styles.switchContainer}>
                <Text style={(styles.switchLabel, { color: 'white' })}>
                  Set current date
                </Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isTodaySwitchOn ? '#fff' : '#f4f3f4'}
                  value={isTodaySwitchOn}
                  onValueChange={handleSwitchToggle}
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={HandleSubmitData}
              >
                <Text style={styles.buttonText}>Submit log</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && renderDatePicker()}
          </View>
        </View>
        <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
          Quick Add
        </Text>
        <QuickAddComponent
          data={QuickAddData}
          userData={userData}
          setCurrentMonthExpense={setCurrentMonthExpense}
          NavigateToQuickAdd={NavigateToQuickAdd}
        />
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: colors.lightyellow,
    padding: 20,
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  darkContent: {
    backgroundColor: colors.gray,
    padding: 20,
    borderRadius: 5,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: fontSize.xxxLarge,
    textAlign: 'center',
    marginTop: 20,
    borderRadius: 50,
  },
  text: {
    fontSize: fontSize.large,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 20,
  },
  field: {
    fontSize: fontSize.middle,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
  },
  input: {
    height: 45,
    borderColor: '#BABABA',
    borderRadius: 50,
    backgroundColor: '#F2F3F4',
    width: 300,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    height: 45,
    backgroundColor: '#408c57',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonDanger: {
    height: 45,
    backgroundColor: colors.pink,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6.8,
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  top: {
    backgroundColor: colors.lightPurple,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    width: '100%',
    // maxWidth: 1400,
    alignSelf: 'center',
  },
})
