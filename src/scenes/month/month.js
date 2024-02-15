import React, { useState, useEffect, useContext } from 'react'
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { useFocusEffect } from '@react-navigation/native'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { UserDataContext } from '../../context/UserDataContext'
import { colors } from '../../theme'
import CustomSwitch from '../../components/toggleSwitch'
import { firestore } from '../../firebase/config'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import { showToast } from '../../utils/ShowToast'
import IconButton from '../../components/IconButton'

export default function Month() {
  const { scheme } = useContext(ColorSchemeContext)
  const { userData, setUserData } = useContext(UserDataContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }
  const textColor = isDark ? 'white' : 'black'

  useFocusEffect(() => {
    setTitle('Month History')
  })

  const onSelectSwitch = (value) => {
    setType(value)
  }

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text>Month Description</Text>
      </ScrollView>
    </ScreenTemplate>
  )
}

const styles = StyleSheet.create({
  lightContent: {
    backgroundColor: '#fff',
  },
  darkContent: {
    backgroundColor: '#34495E',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginVertical: 30,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 10,
    color: colors.primaryText,
    width: '80%',
    height: 45,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#7676768f',
    borderRadius: 15,
    padding: 10,
    marginVertical: 8,
    width: '80%',
    height: 60,
  },
  cat: {
    width: '100%',
    maxWidth: 600,
  },
})
