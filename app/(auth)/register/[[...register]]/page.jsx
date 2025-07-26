import { SignUp } from '@clerk/nextjs'
import React from 'react'
const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <SignUp/>
    </div>
  )
}
export default page