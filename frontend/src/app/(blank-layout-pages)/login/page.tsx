// Next Imports
'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import LoginV2 from '@/views/pages/auth/LoginV2'
import { AuthManager } from '@/utils/authManager'

const LoginPage = () => {

  return <LoginV2 mode='light' />
}

export default LoginPage
