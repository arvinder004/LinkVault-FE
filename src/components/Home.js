import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>Welcome to LinkVault</div>
    </div>
  )
}

export default Home