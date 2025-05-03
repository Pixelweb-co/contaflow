'use client'

import { userMethods } from '@/utils/userMethods'

const CustomerName = () => {
  const loguedUser = userMethods.getUserLogin()

  return <b>{(loguedUser && loguedUser.customer?.name) || ''}</b>
}

export default CustomerName
