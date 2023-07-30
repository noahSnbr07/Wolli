import React from 'react'
import Match from '../pages/fullscreen/Match';
import Statistic from '../pages/inserted/Statistic';
import Icon from './Icon';
import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <nav className='navabar'>
      <CustomLink to='/match' title='Match' icon='sports_volleyball' />
      <CustomLink to='/history' title='Verlauf' icon='history' />
      <CustomLink to='/statistic' title='Statistik' icon='query_stats' />
      <CustomLink to='/' title='Home' icon='home' />
    </nav>
  );
}

function CustomLink({ title, icon, to }) {
  return (
    <Link to={to} className='nav-link'>
      <Icon icon={icon} />
      {title}
    </Link>
  );
}