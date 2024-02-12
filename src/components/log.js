import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import React from 'react'

export default function Log({ title, amount, color, height }) {
  const dynamicCardStyles = {
    ...styles.card,
    backgroundColor: color ? color : styles.card.backgroundColor,
    height: height ? height : styles.card.height,
  }

  return (
    <View style={dynamicCardStyles}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>₹ {amount}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    width: '80%',
    backgroundColor: '#3b8a85',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    padding: 6,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 320,
    height: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  amount: {
    fontSize: 15,
    color: 'white',
  },
})
