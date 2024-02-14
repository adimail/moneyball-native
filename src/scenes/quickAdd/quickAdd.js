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
import { SelectList } from 'react-native-dropdown-select-list'

export default function QuickAdd() {
  const { scheme } = useContext(ColorSchemeContext)
  const { setTitle } = useContext(HomeTitleContext)
  const { userData, setUserData } = useContext(UserDataContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  const ExpenditureData = userData && userData['expenditure']

  // Quick Add information
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState(null)

  useFocusEffect(() => {
    setTitle('Quick Add Shortcuts')
  })

  const onSelectSwitch = (value) => {
    setType(value)
  }

  return (
    <ScreenTemplate>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : 'black' }]}
              value={name}
              onChangeText={setName}
              placeholder="Title"
              placeholderTextColor={isDark ? 'white' : 'black'}
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
              setSelected={() => {
                setCategory(value)
              }}
              search={false}
              data={ExpenditureData}
              save="value"
              placeholder="Select Category"
            />
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : 'black' }]}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Amount"
              placeholderTextColor={isDark ? 'white' : 'black'}
            />
          </View>
        </View>
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
    width: 300,
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
