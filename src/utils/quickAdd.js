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
      <View style={styles.item}>
        <TouchableOpacity style={styles.plus}>
          <IconButton
            icon="plus"
            color={colors.lightPurple}
            size={80}
            // onPress={() => headerButtonPress()}
            containerStyle={{ paddingRight: 15 }}
          />
          <Text>Add new Quick Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const QuickAddItem = ({ title, amounts }) => {
  const [selectedAmountIndex, setSelectedAmountIndex] = useState(null)

  const handleAmountPress = (index) => {
    setSelectedAmountIndex((prevIndex) => (prevIndex === index ? null : index))
  }

  return (
    <View style={styles.item}>
      <View style={styles.body}>
        <Text style={styles.text}>{title}</Text>
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
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
  },
  scrollViewContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  item: {
    width: 210,
    height: 150,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    marginHorizontal: 15,
    borderRadius: 10,
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
    alignItems: 'center',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
  },
  list: {
    display: 'flex',
  },
  amountText: {
    color: 'black',
    fontSize: 18,
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
  },
  selectedAmount: {
    backgroundColor: 'lightblue', // Change color to indicate selected amount
  },
})

export default QuickAddComponent
