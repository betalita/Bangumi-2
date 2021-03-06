/*
 * @Author: czy0729
 * @Date: 2019-06-08 04:35:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-07-17 17:21:02
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Flex, Iconfont, Text, Touchable } from '@components'
import { Popover } from '@screens/_'
import { _ } from '@stores'
import { observer } from '@utils/decorators'
import { DATA_AIRTIME, DATA_MONTH } from '@constants'
import { MODEL_TAG_ORDERBY } from '@constants/model'

const orderData = MODEL_TAG_ORDERBY.data.map(item => item.label)

function ToolBar(props, { $ }) {
  const styles = memoStyles()
  const { order, list, airtime, month } = $.state
  const isEmptyAirdate = airtime === ''
  const isEmptyMonth = month === ''
  return (
    <Flex style={styles.container}>
      <Flex.Item>
        <Popover data={orderData} onSelect={$.onOrderSelect}>
          <Flex style={styles.item} justify='center'>
            <Text type={order ? 'main' : 'sub'} size={12} numberOfLines={1}>
              {order ? MODEL_TAG_ORDERBY.getLabel(order) : '名称'}
            </Text>
            <Iconfont
              style={_.ml.xs}
              name='down'
              size={10}
              color={order ? _.colorMain : undefined}
            />
          </Flex>
        </Popover>
      </Flex.Item>
      <Flex.Item flex={0.8}>
        <Popover data={DATA_AIRTIME} onSelect={$.onAirdateSelect}>
          <Flex style={styles.item} justify='center'>
            <Text size={12} type={isEmptyAirdate ? 'sub' : 'main'}>
              {airtime || '年'}
            </Text>
            <Iconfont
              style={_.ml.xs}
              name='down'
              size={10}
              color={isEmptyAirdate ? _.colorSub : _.colorMain}
            />
          </Flex>
        </Popover>
      </Flex.Item>
      <Flex.Item flex={0.8}>
        <Popover data={DATA_MONTH} onSelect={$.onMonthSelect}>
          <Flex style={styles.item} justify='center'>
            <Text size={12} type={isEmptyMonth ? 'sub' : 'main'}>
              {month || '月'}
            </Text>
            <Iconfont
              style={_.ml.xs}
              name='down'
              size={10}
              color={isEmptyMonth ? _.colorSub : _.colorMain}
            />
          </Flex>
        </Popover>
      </Flex.Item>
      <Flex.Item>
        <Touchable onPress={$.toggleList}>
          <Flex style={styles.item} justify='center'>
            <Iconfont
              name='list'
              size={14}
              color={list ? _.colorMain : undefined}
            />
            <Iconfont
              style={_.ml.md}
              name='order'
              size={12}
              color={!list ? _.colorMain : undefined}
            />
          </Flex>
        </Touchable>
      </Flex.Item>
    </Flex>
  )
}

ToolBar.contextTypes = {
  $: PropTypes.object
}

export default observer(ToolBar)

const memoStyles = _.memoStyles(_ => ({
  container: {
    backgroundColor: _.colorBg
  },
  item: {
    paddingVertical: _.md,
    paddingHorizontal: _.sm
  }
}))
