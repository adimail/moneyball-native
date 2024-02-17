import React, { useEffect, useState, useContext } from 'react'
import { Text, View, ScrollView, StyleSheet, Linking } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import Button from '../../components/Button'
import { useNavigation } from '@react-navigation/native'
import { useRoute } from '@react-navigation/native'
import { colors, fontSize } from 'theme'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { useFocusEffect } from '@react-navigation/native'

export default function UserGuide() {
  const navigation = useNavigation()
  const route = useRoute()
  const { setTitle } = useContext(HomeTitleContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  useFocusEffect(() => {
    setTitle('How to use Moneyball')
  })

  return (
    <ScreenTemplate>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            { backgroundColor: colorScheme.input, color: colorScheme.text },
          ]}
        >
          Moneyball features and uses
        </Text>

        <View style={styles.body}>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Adding Logs: Set title, date, category, amount and submit log from
            home page
          </Text>

          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Deleting Logs: In the history page, you can press and hold to delete
            the log from the database
          </Text>

          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Quick Add: This is the one of the most important feature of
            moneyball. You can set shoutcuts for the most frequent expenses and
            can add them in your logbook in a single click
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            For instance, if you frequently use an auto-rickshaw/Metro, with
            varying fares such as 25₹, 10₹, or 50₹, this feature enables you to
            swiftly add these expenses with just a single click. This simplifies
            the tracking of both small and large expenses, providing you with an
            easy overview of your spending habits.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Login in different account and the data is avaliable to you on any
            device
          </Text>
          <Text
            style={[
              styles.content,
              {
                backgroundColor: colorScheme.input,
                color: colorScheme.text,
                marginBottom: 50,
              },
            ]}
          >
            Filters and sorting: You can sort the data in ascending or
            descending order on the basis of date added or amount spend. Users
            can also filter by categories in the history tab.
          </Text>
        </View>
        <Text
          style={[
            styles.title,
            { backgroundColor: colorScheme.input, color: colorScheme.text },
          ]}
        >
          CURD operations + Cloud storage + Tracking micro expenses in single
          clicks + User Authentication + Light & Dark mode UI + Cross platform
        </Text>
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
    maxWidth: 600,
    padding: 10,
  },
  title: {
    fontSize: 27,
    marginBottom: 20,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 20,
    paddingVertical: 10,
  },
  content: {
    marginVertical: 3,
  },
  body: {
    paddingHorizontal: 15,
  },
})
