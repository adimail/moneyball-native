import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import React from 'react'
import { colors } from '../theme'

export default function Card({ title, amount, color, height, navigate }) {
  const dynamicCardStyles = {
    ...styles.card,
    backgroundColor: color ? color : styles.card.backgroundColor,
    height: height ? height : styles.card.height,
    navigate: navigate ? navigate : 'home',
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
    backgroundColor: colors.primaryText,
    paddingHorizontal: 20,
    paddingVertical: 5,
    padding: 6,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 320,
    height: 50,
    alignSelf: 'center',
    margin: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 17,
    marginBottom: 5,
    color: 'white',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
})
