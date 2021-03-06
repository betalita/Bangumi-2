/*
 * @Author: czy0729
 * @Date: 2019-10-01 15:37:16
 * @Last Modified by: czy0729
 * @Last Modified time: 2020-09-24 19:59:23
 */
import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { TabsV2 } from '@components'
import List from './list'

function Tabs(props, { $ }) {
  const { page } = $.state
  return (
    <TabsV2
      routes={$.tabs}
      page={page}
      renderItem={item => <List key={item.key} id={item.key} />}
      onChange={$.onChange}
    />
  )
}

Tabs.contextTypes = {
  $: PropTypes.object
}

export default observer(Tabs)
