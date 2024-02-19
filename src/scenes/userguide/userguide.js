import React, { useContext } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import ScreenTemplate from '../../components/ScreenTemplate'
import { colors } from 'theme'
import { HomeTitleContext } from '../../context/HomeTitleContext'
import { ColorSchemeContext } from '../../context/ColorSchemeContext'
import { useFocusEffect } from '@react-navigation/native'

export default function UserGuide() {
  const { setTitle } = useContext(HomeTitleContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  useFocusEffect(() => {
    setTitle('User Guide for Moneyball')
  })

  return (
    <ScreenTemplate>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        {renderText(styles.title, 'Moneyball 101')}

        <View style={styles.body}>
          {renderText(styles.header, 'Add Logs')}
          {renderText(styles.content, '1. From Home page:')}
          {renderText(styles.listitem, '- Set Title')}
          {renderText(styles.listitem, '- Set Date')}
          {renderText(styles.listitem, '- Set Category')}
          {renderText(styles.listitem, '- Set Amount')}
          {renderText(styles.listitem, 'And click on submit log')}
          {renderText(styles.header, 'Delete Logs')}
          {renderText(styles.content, '1. From History page:')}
          {renderText(styles.listitem, '- Hold and press the log')}
          {renderText(styles.listitem, '- Delete the log')}
          {renderText(styles.header, 'Quick Add')}
          {renderText(
            styles.content,
            'Quick adds are customisable templates for most frequent expenses of the user that they can define in the quick add page',
          )}
          {renderText(styles.content, '1. Create new Quick Add')}
          {renderText(
            styles.listitem,
            '- Press plus button in quick add horizontal scroll view',
          )}
          {renderText(
            styles.listitem,
            '- Define the title, category and amounts of the template',
          )}
          {renderText(
            styles.listitem,
            '- You must add exactly 3 amounts per category',
          )}
          {renderText(styles.listitem, '- You can add upto 6 Quick Adds')}
          {renderText(styles.content, '2. Delete Quick Add')}
          {renderText(
            styles.listitem,
            '- Click on trash bin icon in the quick add box',
            '- Confirm delete',
          )}
        </View>
      </ScrollView>
    </ScreenTemplate>
  )
}

function renderText(style, text) {
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  return (
    <Text
      style={[
        style,
        { backgroundColor: colorScheme.input, color: colorScheme.text },
      ]}
    >
      {text}
    </Text>
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
  },
  title: {
    textAlign: 'center',
    fontSize: 27,
    marginBottom: 10,
    margin: 20,
  },
  content: {
    fontSize: 15,
    marginVertical: 3,
    marginVertical: 3,
    marginTop: 5,
  },
  header: {
    fontSize: 19,
    marginTop: 30,
  },
  listitem: {
    fontSize: 13,
    marginLeft: 30,
  },
  body: {
    paddingHorizontal: 15,
  },
})
