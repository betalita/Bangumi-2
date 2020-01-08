/*
 * @Author: czy0729
 * @Date: 2020-01-08 15:21:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-01-08 16:37:37
 */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { Flex, Text, Touchable } from '@components'
import { Avatar } from '@screens/_'
import { _ } from '@stores'
import { tinygrailOSS } from '@utils/app'
import { t } from '@utils/fetch'
import { EVENT } from '@constants'

function Item(props, { navigation }) {
  const styles = memoStyles()
  const {
    index,
    id,
    name,
    icon,
    bonus,
    rate,
    level,
    event,
    firstAsks,
    firstAmount,
    mark
  } = props
  const { id: eventId, data: eventData } = event
  const isTop = index === 0
  return (
    <Flex style={styles.container} align='start'>
      <Avatar
        style={styles.image}
        src={tinygrailOSS(icon)}
        size={40}
        name={name}
        borderColor='transparent'
        onPress={() => {
          t(eventId, {
            to: 'Mono',
            monoId: id,
            ...eventData
          })

          navigation.push('Mono', {
            monoId: `character/${id}`
          })
        }}
      />
      <Flex.Item style={!isTop && styles.border}>
        <Touchable
          style={styles.item}
          onPress={() => {
            t(eventId, {
              to: 'TinygrailDeal',
              monoId: id,
              ...eventData
            })

            navigation.push('TinygrailDeal', {
              monoId: `character/${id}`
            })
          }}
        >
          <Flex>
            <Flex.Item>
              <Text
                style={{
                  color: _.colorTinygrailPlain
                }}
                size={15}
              >
                {index + 1}.{name}
                {!!bonus && (
                  <Text size={12} lineHeight={15} type='warning'>
                    {' '}
                    x{bonus}
                  </Text>
                )}
                {parseInt(level) > 1 && (
                  <Text
                    style={{
                      color: _.colorAsk
                    }}
                    size={12}
                    lineHeight={15}
                  >
                    {' '}
                    lv{level}
                  </Text>
                )}
              </Text>
              <Text
                style={[
                  _.mt.xs,
                  {
                    color: _.colorTinygrailText
                  }
                ]}
                size={11}
              >
                <Text
                  style={{
                    color: _.colorAsk
                  }}
                  size={11}
                >
                  {firstAmount}股
                </Text>{' '}
                / ₵{firstAsks} / +{rate}
              </Text>
            </Flex.Item>
            <Text
              style={{
                color: _.colorTinygrailPlain
              }}
              size={16}
            >
              {mark}
            </Text>
          </Flex>
        </Touchable>
      </Flex.Item>
    </Flex>
  )
}

Item.contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object
}

Item.defaultProps = {
  event: EVENT
}

export default observer(Item)

const memoStyles = _.memoStyles(_ => ({
  container: {
    paddingLeft: _.wind,
    backgroundColor: _.colorTinygrailContainer
  },
  image: {
    marginRight: _.xs,
    marginTop: _.md
  },
  item: {
    paddingVertical: _.md,
    paddingRight: _.wind,
    paddingLeft: _.sm
  },
  border: {
    borderTopColor: _.colorTinygrailBorder,
    borderTopWidth: _.hairlineWidth
  }
}))
