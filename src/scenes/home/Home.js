import React, { useEffect, useState, useContext, useLayoutEffect } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import IconButton from '../../components/IconButton'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { firestore } from '../../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'
import { colors, fontSize } from '../../theme'
import { UserDataContext } from '../../context/UserDataContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { sendNotification } from '../../utils/SendNotification'
import { getKilobyteSize } from '../../utils/functions'
import Card from '../../components/expenseCard'
import DateTimePicker from '@react-native-community/datetimepicker'
import { TouchableOpacity } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'

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

  const data = [
    'Food',
    'Stationary',
    'Rickshaw',
    'Metro',
    'Accessories andt',
    'Hygiene',
    'Medicines',
    'A1004',
    'Travel',
    'Other',
  ]

  // Account Information
  const [amount, setAmount] = useState()
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selected, setSelected] = React.useState({
    key: '3',
    value: 'Rickshaw',
  })
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [isTodaySwitchOn, setIsTodaySwitchOn] = useState(
    date.toDateString() === new Date().toDateString(),
  )

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
      setIsTodaySwitchOn(
        selectedDate.toDateString() === new Date().toDateString(),
      )
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

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <IconButton
  //         icon="user-circle"
  //         color={colors.lightPurple}
  //         size={24}
  //         onPress={() => headerButtonPress()}
  //         containerStyle={{ paddingRight: 15 }}
  //       />
  //     ),
  //   })
  // }, [navigation])

  // const headerButtonPress = () => {
  //   alert('Render Profile Navigator')
  //   navigation.navigate('Profile')
  // }

  useEffect(() => {
    const tokensRef = doc(firestore, 'tokens', userData.id)
    const tokenListner = onSnapshot(tokensRef, (querySnapshot) => {
      if (querySnapshot.exists) {
        const data = querySnapshot.data()
        setToken(data)
      } else {
        console.log('No such document!')
      }
    })
    return () => tokenListner()
  }, [])

  const handleCategorySelection = (value) => {
    setSelected(value)
    const currentDate = new Date()
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    })
    setTitle(`${value} ${formattedDate}`)
  }

  const handleSwitchToggle = (value) => {
    setIsTodaySwitchOn(value)
    if (value) {
      setDate(new Date())
    }
  }

  React.useEffect(() => {
    if (!isTodaySwitchOn) {
      setShowDatePicker(true)
    }
  }, [isTodaySwitchOn])

  const submitData = () => {
    if (title && selected && amount !== null) {
      const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })

      const logInfo = `Name: ${title}\nDate: ${formattedDate}\nCategory: ${selected.value}\nAmount: ${amount}₹`

      Alert.alert('Log added', logInfo)

      setAmount('')
      setTitle('')
      setDate(new Date())
      setIsTodaySwitchOn(true)
      setCategory('')
    } else {
      Alert.alert('Please fill in all required fields')
    }
  }

  return (
    <ScreenTemplate>
      <ScrollView style={styles.main}>
        <View style={styles.container}>
          <Card title="Last 7 days" amount="50" />
          <Card title="Current week" amount="50" />
          <Card title="Current month" amount="50" />
          <Card title="Month misc. expenses" amount="50" color="#da8540" />
        </View>

        <View
          style={[
            styles.separator,
            { backgroundColor: isDark ? 'white' : 'gray' },
          ]}
        />

        {/* <View style={colorScheme.content}>
          <Text style={[styles.field, { color: colorScheme.text }]}>Mail:</Text>
          <Text style={[styles.title, { color: colorScheme.text }]}>
            {userData.email}
          </Text>
        </View> */}

        <Text style={[styles.text, { color: isDark ? 'white' : 'black' }]}>
          {'Date: ' +
            date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
        </Text>

        <View style={styles.container}>
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
              backgroundColor: '#DBDBDB',
              width: 300,
              borderWidth: 1,
              paddingHorizontal: 10,
            }}
            dropdownTextStyles={{ color: 'grey' }}
            setSelected={handleCategorySelection}
            search={false}
            data={data}
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
              <Text
                style={
                  (styles.switchLabel, { color: isDark ? 'white' : 'black' })
                }
              >
                Set current date
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isTodaySwitchOn ? '#fff' : '#f4f3f4'}
                value={isTodaySwitchOn}
                onValueChange={handleSwitchToggle}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={submitData}>
              <Text style={styles.buttonText}>Add to database</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && renderDatePicker()}

          <TouchableOpacity
            style={[
              styles.button,
              {
                paddingHorizontal: 30,
                backgroundColor: 'green',
              },
            ]}
            onPress={() => {
              navigation.navigate('ModalStacks', {
                screen: 'Post',
                params: {
                  data: userData,
                  from: 'Home screen',
                },
              })
            }}
          >
            <Text style={styles.buttonText}>Quick Add</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: isDark ? 'white' : 'gray' }]}>
            Recent Entries
          </Text>
        </View>
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
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  main: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  title: {
    fontSize: fontSize.xLarge,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: fontSize.middle,
    marginBottom: 15,
    textAlign: 'center',
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
  },
  input: {
    height: 45,
    borderColor: '#BABABA',
    borderRadius: 50,
    backgroundColor: '#DBDBDB',
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
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  separator: {
    marginVertical: 24,
    height: 1,
    width: '60%',
    alignSelf: 'center',
  },
})
