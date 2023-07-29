import React from 'react'
import '../config/config.css';
import Icon from './Icon';
export default function Popup({ type, text, is, handleClick }) {
 return (
  <div className='popup'
   style={is ? { display: 'flex' } : { display: 'none' }}
  >
   <h1> {text} </h1>
   {
    type === 'number' ?
     <div>
      number
     </div>
     : type === 'boolean' ?
      <div className='popupOptions'>
       <button onClick={() => { handleClick(true) }} style={{ background: 'var(--accent)' }} > <Icon icon='check' /> </button>
       <button onClick={() => { handleClick(false) }} style={{ background: 'var(--bg-2)' }} > <Icon icon='close' /> </button>
      </div>
      :
      console.error('Invalid parameter')
   }
  </div >
 );
}