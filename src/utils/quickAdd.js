import React, { useState, useContext } from 'react'
import { ColorSchemeContext } from '../context/ColorSchemeContext'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native'
import IconButton from '../components/IconButton'
import { colors } from '../theme'
import { submitData } from './SubmitUserData'
import { showToast } from './ShowToast'
import FontIcon from 'react-native-vector-icons/FontAwesome5'

const QuickAddComponent = ({ data, userData, setCurrentMonthExpense }) => {
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'

  const handleNewQuickAdd = () => {
    showToast({
      title: 'New quick add added',
      body: 'You can add upto 10 quick adds',
      isDark,
    })
  }

  const handleAddLog = (title, amount, category) => {
    const type = 'Expenditure'

    submitData(
      type,
      title,
      amount,
      category,
      userData,
      new Date(),
      setCurrentMonthExpense,
    )
      .then(() => {
        showToast({
          title: 'Log Added',
          body: title,
          isDark,
        })
      })
      .catch((error) => {
        console.error('Error adding document: ', error)
        Alert.alert('Error', 'Failed to add log. Please try again.')
      })
  }

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {data &&
        data.map((item, index) => (
          <QuickAddItem
            key={index}
            title={item.title}
            amounts={item.amounts}
            category={item.category}
            userData={userData}
            handleAddLog={handleAddLog}
          />
        ))}

      <TouchableOpacity onPress={() => handleNewQuickAdd()}>
        <View style={[styles.item, { alignItems: 'center' }]}>
          <FontIcon name="plus" color={colors.white} size={81} />
          <Text
            style={{ color: colors.white, fontSize: 18, textAlign: 'center' }}
          >
            New Quick Add
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

const QuickAddItem = ({ title, amounts, category, userData, handleAddLog }) => {
  const [selectedAmountIndex, setSelectedAmountIndex] = useState(0)

  const handleAmountPress = (index) => {
    setSelectedAmountIndex((prevIndex) =>
      prevIndex === index ? prevIndex : index,
    )
  }

  return (
    <View style={styles.item}>
      <View style={styles.body}>
        <Text style={[styles.text, { color: 'white', paddingBottom: 5 }]}>
          {title}
        </Text>

        <View style={styles.buttons}>
          {amounts &&
            amounts.map((amount, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.list,
                  selectedAmountIndex === index && styles.selectedAmount,
                ]}
                onPress={() => handleAmountPress(index)}
              >
                <Text style={styles.amountText}>{amount}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="pen"
          color={colors.white}
          size={24}
          // onPress={() => headerButtonPress()}
          containerStyle={{ paddingRight: 15 }}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#408c57' }]}
          onPress={() => {
            handleAddLog(title, amounts[selectedAmountIndex], category)
          }}
        >
          <Text style={styles.buttonText}>Add Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 180,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  item: {
    width: 222,
    height: 150,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.primaryText,
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: 80,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '50%',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: '#EAECEE',
    width: 190,
    padding: 8,
    borderRadius: 100,
    justifyContent: 'space-around',
  },
  list: {
    display: 'flex',
  },
  amountText: {
    color: 'white',
    fontSize: 15,
    backgroundColor: '#2C3E50',
    padding: 2,
    borderRadius: 100,
    width: 41,
    textAlign: 'center',
  },
  selectedAmount: {
    transform: [{ scale: 1.3 }],
  },
})

export default QuickAddComponent
