import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import IconButton from '../components/IconButton'
import { colors } from '../theme'

const QuickAddComponent = ({ data }) => {
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {data &&
        data.map((item, index) => (
          <QuickAddItem key={index} title={item.title} amounts={item.amounts} />
        ))}

      <View style={styles.plus}>
        <IconButton
          icon="plus"
          color={colors.lightGrayPurple}
          size={80}
          // onPress={() => headerButtonPress()}
          containerStyle={{ paddingRight: 15 }}
        />
        <Text style={{ color: colors.black, fontSize: 18 }}>New Quick Add</Text>
      </View>
    </ScrollView>
  )
}

const QuickAddItem = ({ title, amounts }) => {
  const [date, setDate] = useState(new Date())
  const [selectedAmountIndex, setSelectedAmountIndex] = useState(0)

  const handleAmountPress = (index) => {
    setSelectedAmountIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <View style={styles.item}>
      <View style={styles.body}>
        <Text style={styles.text}>{title}</Text>
        <Text style={{ color: 'white', paddingBottom: 5 }}>
          {date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
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
    width: 210,
    height: 180,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 20,
    borderWidth: 0.5,
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
  plus: {
    width: 210,
    height: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#808B96',
    marginHorizontal: 15,
    borderRadius: 20,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
