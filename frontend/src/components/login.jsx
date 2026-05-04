import React from 'react'

function login() {
  return (
    <div >
        <header className='text-3xl font-bold text-center mt-10'>Login</header>
        <div className='flex flex-col items-center mt-10'>
            <input type="text" placeholder='Username' className='border-2 border-gray-300 rounded-md p-2 mb-4 w-64'/>
            <input type="password" placeholder='Password' className='border-2 border-gray-300 rounded-md p-2 mb-4 w-64'/>
            <button className='bg-blue-500 text-white rounded-md px-4 py-2'>Login</button>
        </div>
      
    </div>
  )
}

export default login
