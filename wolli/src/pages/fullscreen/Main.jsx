import React, { useState } from 'react'
import Navbar from '../../config/Navbar'
import { Routes, Route } from 'react-router-dom';
import Match from './Match';
import Statistic from '../inserted/Statistic';
import History from '../inserted/History';
import '../../config/config.css'
export default function Main() {
 const [isActive, setActive] = useState({
  navbar: true,
  match: false,
  history: false,
  statistic: false,
 })
 return (
  
   <div className='main'>
    <Navbar />
    <main className='main-viewport'>
     <Routes>
      <Route path='/match' element={<Match />} />
      <Route path='/history' element={<History />} />
      <Route path='/statistic' element={<Statistic />} />
     </Routes>
    </main>
   </div>
  
 );
}