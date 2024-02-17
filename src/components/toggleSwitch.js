import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const CustomSwitch = ({
  navigation,
  selectionMode,
  roundCorner,
  options,
  onSelectSwitch,
  selectionColor,
  height,
  borderRadius,
}) => {
  const [getSelectionMode, setSelectionMode] = useState(0)
  const [getRoundCorner, setRoundCorner] = useState(roundCorner)

  const updatedSwitchData = (index) => {
    const selectedOption = options[index]
    setSelectionMode(index)
    onSelectSwitch(selectedOption)
  }

  return (
    <View>
      <View
        style={{
          height: height || 44,
          backgroundColor: 'white',
          borderRadius: getRoundCorner ? borderRadius || 25 : 0,
          borderWidth: 1,
          borderColor: selectionColor,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
          alignSelf: 'center',
          marginHorizontal: 10,
        }}
      >
        {options &&
          options.map((option, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={() => updatedSwitchData(index)}
              style={{
                flex: 1,
                backgroundColor:
                  getSelectionMode === index ? selectionColor : 'white',
                borderRadius: getRoundCorner ? borderRadius || 25 : 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: getSelectionMode === index ? 'white' : selectionColor,
                  width: 100,
                  textAlign: 'center',
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  )
}

export default CustomSwitch
