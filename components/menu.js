/*
 * @Author: czy0729
 * @Date: 2019-04-06 06:57:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2019-05-05 20:58:01
 */
import React from 'react'
import { StyleSheet, View } from 'react-native'
import _, { window, colorPlain, colorBorder } from '@styles'
import Text from './text'
import Touchable from './touchable'

const Menu = ({ style, title, data, onSelect }) => (
  <View style={[styles.container, style]}>
    {title.length !== 0 && (
      <View style={styles.title}>
        {title.map((item, index) => (
          <Text
            key={item}
            style={index !== 0 && _.mt.sm}
            type='sub'
            size={12}
            align='center'
          >
            {item}
          </Text>
        ))}
      </View>
    )}
    {data.map((item, index) => {
      if (typeof item === 'string') {
        return (
          <View key={item} style={_.border.top}>
            <Touchable style={styles.item} onPress={() => onSelect(item)}>
              <Text size={16} align='center'>
                {item}
              </Text>
            </Touchable>
          </View>
        )
      }

      if (item.type === 'divider') {
        // eslint-disable-next-line react/no-array-index-key
        return <View key={index} style={styles.divider} />
      }

      return (
        <View key={item.title} style={_.border.top}>
          <Touchable style={styles.item} onPress={() => onSelect(item.title)}>
            {item.title}
          </Touchable>
        </View>
      )
    })}
  </View>
)

Menu.defaultProps = {
  style: undefined,
  title: [], // ['a', 'b'] | ['a', { title: <Text>b</Text>, disabled: true }]
  data: [],
  onSelect: () => {}
}

export default Menu

const styles = StyleSheet.create({
  container: {
    width: window.width * 0.5
  },
  title: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colorPlain
  },
  item: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colorPlain
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colorBorder
  }
})