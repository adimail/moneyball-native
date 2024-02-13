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

export default function Post() {
  const { scheme } = useContext(ColorSchemeContext)
  const { setTitle } = useContext(HomeTitleContext)
  const { userData, setUserData } = useContext(UserDataContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }
  const [type, setType] = useState('Expenditure')
  const [newCategory, setNewCategory] = useState('')
  const [expenseCategories, setExpenseCategories] = useState([])
  const [incomeCategories, setIncomeCategories] = useState([])
  const textColor = isDark ? 'white' : 'black'

  const ExpenditureData = userData && userData['expenditure categories']
  const SavingsData = userData && userData['income categories']

  useEffect(() => {
    if (
      userData &&
      userData['expenditure categories'] &&
      userData['income categories']
    ) {
      setExpenseCategories(userData['expenditure categories'])
      setIncomeCategories(userData['income categories'])
    }
  }, [userData])

  // function to add a category
  const addCategory = (newCategory, type) => {
    if (newCategory) {
      const updatedCategories = [
        ...(type === 'Expenditure' ? ExpenditureData : SavingsData),
        newCategory,
      ]

      if (type === 'Expenditure') {
        setUserData((prevUserData) => ({
          ...prevUserData,
          'expenditure categories': updatedCategories,
        }))
      } else {
        setUserData((prevUserData) => ({
          ...prevUserData,
          'income categories': updatedCategories,
        }))
      }

      const userDocRef = doc(firestore, 'users', userData.id)
      updateDoc(userDocRef, {
        [type.toLowerCase() + ' categories']: updatedCategories,
      })

      showToast({
        title: 'Category Added',
        body: newCategory,
        isDark,
      })

      setNewCategory('')
    } else {
      console.error('New category is undefined or null')
    }
  }

  // Function to remove a category
  const removeCategory = (category, type) => {
    Alert.alert(
      'Confirm',
      `Are you sure you want to remove the category "${category}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            const updatedCategories = (
              type === 'Expenditure' ? ExpenditureData : SavingsData
            ).filter((cat) => cat !== category)
            if (type === 'Expenditure') {
              setUserData((prevUserData) => ({
                ...prevUserData,
                'expenditure categories': updatedCategories,
              }))
            } else {
              setUserData((prevUserData) => ({
                ...prevUserData,
                'income categories': updatedCategories,
              }))
            }

            const userDocRef = doc(firestore, 'users', userData.id)
            if (type === 'Expenditure') {
              updateDoc(userDocRef, {
                'expenditure categories': updatedCategories,
              })
            } else {
              updateDoc(userDocRef, {
                'income categories': updatedCategories,
              })
            }
          },
        },
      ],
    )
  }

  const onSelectSwitch = (value) => {
    setType(value)
  }

  return (
    <ScreenTemplate>
      <ScrollView>
        <View style={styles.container}>
          <CustomSwitch
            selectionMode={1}
            roundCorner={true}
            option1={'Expenditure'}
            option2={'Income'}
            onSelectSwitch={onSelectSwitch}
            selectionColor={'#1C2833'}
          />
          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
            Categories
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : 'black' }]}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Enter new category"
              placeholderTextColor={isDark ? 'white' : 'black'}
            />
            {/* Add category button */}
            <Button
              title={`Add ${
                type === 'Expenditure' ? 'Expense' : 'Income'
              } Category`}
              onPress={() => addCategory(newCategory, type)}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
            {type === 'Expenditure'
              ? 'Expenditure Categories'
              : 'Income Categories'}
          </Text>

          {type === 'Expenditure' ? (
            <View>
              {expenseCategories.map((item, index) => (
                <View style={styles.categoryItem} key={index}>
                  <Text
                    style={[styles.text, { color: isDark ? 'white' : 'black' }]}
                  >
                    {item}
                  </Text>
                  <Button
                    title="Remove"
                    onPress={() => removeCategory(item, type)}
                    color={colors.danger}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text style={[styles.subtitle, colorScheme.text]}>
                Income Categories
              </Text>
              {incomeCategories.map((item, index) => (
                <View style={styles.categoryItem} key={index}>
                  <Text
                    style={[styles.text, { color: isDark ? 'white' : 'black' }]}
                  >
                    {item}
                  </Text>
                  <Button
                    title="Remove"
                    onPress={() => removeCategory(item, type)}
                    color={colors.danger} // Adjust button color
                  />
                </View>
              ))}
            </View>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    color: colors.primaryText, // Adjust input text color
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
})
