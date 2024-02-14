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

  const ExpenditureData = userData && userData['expenditure']
  const SavingsData = userData && userData['income']

  useFocusEffect(() => {
    setTitle('Custom Categories')
  })

  useEffect(() => {
    if (userData && userData['expenditure'] && userData['income']) {
      setExpenseCategories(userData['expenditure'])
      setIncomeCategories(userData['income'])
    }
  }, [userData])

  // function to add a category
  const addCategory = async (newCategory, type) => {
    if (newCategory) {
      const updatedCategories = [
        ...(type === 'Expenditure' ? ExpenditureData : SavingsData),
        newCategory,
      ]

      if (updatedCategories.length > 9) {
        showToast({
          title: 'Stack Overflow',
          body: 'You can Add up to 9 max categories',
          isDark,
        })
        return
      }

      try {
        const userDocRef = doc(firestore, 'users', userData.id)
        await updateDoc(userDocRef, {
          [type.toLowerCase()]: updatedCategories,
        })

        if (type === 'Expenditure') {
          setUserData((prevUserData) => ({
            ...prevUserData,
            expenditure: updatedCategories,
          }))
        } else {
          setUserData((prevUserData) => ({
            ...prevUserData,
            income: updatedCategories,
          }))
        }

        showToast({
          title: 'Category Added',
          body: newCategory,
          isDark,
        })

        setNewCategory('')
      } catch (error) {
        console.error('Error adding category:', error.message)
        showToast({
          title: 'Error',
          body: 'Failed to add category. Please try again.',
          isDark,
        })
      }
    }
  }

  // Function to remove a category
  const removeCategory = (category, type) => {
    const updatedCategories =
      type === 'Expenditure' ? [...ExpenditureData] : [...SavingsData]

    if (updatedCategories.length === 1) {
      alert('You shall have atleast one category in the list.', [
        { text: 'OK', style: 'cancel' },
      ])
      return
    }

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
          onPress: async () => {
            const updatedCategories = (
              type === 'Expenditure' ? ExpenditureData : SavingsData
            ).filter((cat) => cat !== category)

            if (type === 'Expenditure') {
              setUserData((prevUserData) => ({
                ...prevUserData,
                expenditure: updatedCategories,
              }))
            } else {
              setUserData((prevUserData) => ({
                ...prevUserData,
                income: updatedCategories,
              }))
            }

            const userDocRef = doc(firestore, 'users', userData.id)
            if (type === 'Expenditure') {
              await updateDoc(userDocRef, { expenditure: updatedCategories })
            } else {
              await updateDoc(userDocRef, { income: updatedCategories })
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <CustomSwitch
            selectionMode={1}
            roundCorner={true}
            option1={'Expenditure'}
            option2={'Income'}
            onSelectSwitch={onSelectSwitch}
            selectionColor={'#1C2833'}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { color: isDark ? 'white' : 'black' }]}
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Enter new category"
              placeholderTextColor={isDark ? 'white' : 'black'}
            />
            <Button
              title={`Add New ${
                type === 'Expenditure' ? 'Expense' : 'Income'
              } Category`}
              onPress={() => addCategory(newCategory, type)}
              color={
                (type === 'Expenditure' && expenseCategories.length > 8) ||
                (type === 'Income' && incomeCategories.length > 8)
                  ? colors.pink
                  : colors.primary
              }
            />
          </View>

          <Text style={[styles.title, { color: isDark ? 'white' : 'black' }]}>
            {type === 'Expenditure'
              ? `expenditure ${expenseCategories.length}/9`
              : `income ${incomeCategories.length}/9`}
          </Text>

          {type === 'Expenditure' ? (
            <View style={styles.cat}>
              {expenseCategories.map((item, index) => (
                <View style={styles.categoryItem} key={index}>
                  <Text
                    style={[styles.text, { color: isDark ? 'white' : 'black' }]}
                  >
                    {item}
                  </Text>
                  <IconButton
                    icon="trash"
                    color={colors.primary}
                    size={20}
                    onPress={() => removeCategory(item, type)}
                    containerStyle={{ paddingRight: 15 }}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.cat}>
              {incomeCategories.map((item, index) => (
                <View style={styles.categoryItem} key={index}>
                  <Text
                    style={[styles.text, { color: isDark ? 'white' : 'black' }]}
                  >
                    {item}
                  </Text>
                  <IconButton
                    icon="trash"
                    color={colors.primary}
                    size={20}
                    onPress={() => removeCategory(item, type)}
                    containerStyle={{ paddingRight: 15 }}
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
