import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>Welcome to LinkVault</div>
      <button onClick={() => navigate('/signup')}>Sign Up</button>
      <button onClick={() => navigate('/signin')}>Sign In</button>
    </div>
  )
}

export default Home