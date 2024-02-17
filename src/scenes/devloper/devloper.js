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

export default function Developer() {
  const navigation = useNavigation()
  const route = useRoute()
  const { from, userData, title } = route.params
  const { setTitle } = useContext(HomeTitleContext)
  const { scheme } = useContext(ColorSchemeContext)
  const isDark = scheme === 'dark'
  const colorScheme = {
    content: isDark ? styles.darkContent : styles.lightContent,
    text: isDark ? colors.white : colors.primaryText,
  }

  useFocusEffect(() => {
    setTitle(title)
  })

  const handleLinkPress = () => {
    // Define the URL you want to open
    const url = 'https://adimail.github.io'

    // Open the URL using Linking
    Linking.openURL(url)
  }

  return (
    <ScreenTemplate>
      <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
        <Text
          style={[
            styles.title,
            { backgroundColor: colorScheme.input, color: colorScheme.text },
          ]}
        >
          How can you not be romantic about programming?
        </Text>

        <View style={styles.body}>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            There’s a scene in Moneyball in which Brad Pitt’s character, the
            manager of the Oakland A’s, is watching a recording of one of his
            players trying so hard to run fast that he stumbles and falls. Lying
            on the ground he’s angry at himself, because he doesn’t realize that
            right before he started his run he hit a home run and scored the
            game-winning points. Watching the scene, Pitt leans back, smiles a
            Brad Pitt smile and says: “how can you not be romantic about
            baseball?”
          </Text>

          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            There are moments in which I ask myself the same thing about
            programming.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            We’re programming computers. We spend large parts of our days
            writing down instructions for machines. Other parts of the day are
            spent making sure that we chose the right instructions. Then we talk
            about those instructions: why and how we picked the ones we picked,
            which ones we will consider in the future, what those should do and
            why and how long it will probably take to write those down.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            It can sound very serious and dry; a bureaucracy of computer
            instructions. And yet.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            And yet we, the ostensible bureaucrats, talk about magic as
            something that exists — the good and the bad kind. There are
            wizards. Instructions are “like a sorcerer’s spells”.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            We don’t call them instructions, though, not when talking about what
            we produce each day anyway. It’s code we write. Emotions are
            involved. Code, we say, can be: neat, nice, clean, crafted, baroque,
            minimal, solid, defensive, hacky, a hack, art, a piece of shit, the
            stupidest thing I’ve ever read, beautiful, like a poem.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Some lines of code are a riddle to anyone but their author and the
            name code serves as a warning. Other times, strangely, it’s a badge
            of honor.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            Fantastic amounts of code have been written, from beginning to end,
            by a single person, typing away night after night after night, for
            years, until one day the code is fed to a machine and, abracadabra,
            a brightly coloured amusement park appears on screen. Other code has
            been written, re-written, torn apart and stitched back together
            across time zones, country borders and decades, not by a single
            person, but by hundreds or even thousands of different people.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            This world of programming is held together by code. Millions and
            millions of lines of code. Nobody knows how much there is. Some of
            it is more than 30 years old, some less than a week, and chances are
            you used parts of both yesterday. There are lines of code floating
            around on our computers that haven’t been executed by a machine in
            years and probably won’t be for another lifetime. Others are the
            golden threads of this world, holding it together at the seams with
            no more than a dozen people knowing about it. Remove one of these
            and it all comes crashing down.
          </Text>
          <Text
            style={[
              styles.content,
              { backgroundColor: colorScheme.input, color: colorScheme.text },
            ]}
          >
            If you haven’t been here long enough and try to guess how much there
            is and how many generations are layered on top of each other — you
            won’t even come close. But stay around. After a while, more and
            more, you’ll find yourself in moments of awe, stunned by the size
            and fragility of it all; the mountains of work and talent and
            creativity and foresight and intelligence and luck that went into
            it. And you’ll reach for the word “magic” because you won’t know how
            else to describe it and then you lean back and smile, wondering how
            someone could not.
          </Text>
        </View>

        <Text
          style={[
            styles.subheading,
            { backgroundColor: colorScheme.input, color: colorScheme.text },
          ]}
        >
          This is an beautiful article written by Thorsten Ball. The author of
          the book "Writing An Interpreter In Go" & "Writing A Compiler In Go"
        </Text>

        <Text
          style={[
            styles.subheading,
            { backgroundColor: colorScheme.input, color: colorScheme.text },
          ]}
        >
          This cross platform application is made by{' '}
          <Text style={{ color: colors.blueLight }} onPress={handleLinkPress}>
            Aditya Godse
          </Text>
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
