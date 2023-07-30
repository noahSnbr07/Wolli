import React, { useEffect, useState } from 'react'
import '../../styles/welcome.css';
import Github from '../../icons/github.png';
import Instagram from '../../icons/instagram.png';
import Reddit from '../../icons/reddit.png';
import Icon from '../../config/Icon.jsx';
import { Link } from 'react-router-dom';
export default function Welcome() {
  const [users, setUsers] = useState(['noah', 'max', 'jannis', 'lina']);
  const [UserPopup, setUserPopup] = useState(false);
  const [newLoggedInUser, setNewLoggedInUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const StartButton = () => {
    return (
      <Link to={'/main'} className='startButton'>
        Start
      </Link>
    );
  }

  const SocialBox = () => {
    return (
      <div className='socialBox'>
        <a href='https://www.instagram.com/noah.snbr/'> <img src={Instagram} alt='Instagram' /> </a>
        <a href='https://github.com/noahSnbr07'> <img src={Github} alt='GitHub' /> </a>
        <a href='https://www.reddit.com/user/noah-snbr'> <img src={Reddit} alt='Reddit' /> </a>
      </div>
    );
  }

  const SettingsButton = () => {
    return (
      <Link to={'/settings'}>
        <button className='settingsButton'>
          Einstellungen
        </button>
      </Link>
    );
  }

  const UserSelecter = () => {
    const [lastLoggedInUser, setLastLoggedInUser] = useState('');
    //check for localStorage variables
    const selectLastUser = (type) => {
      if (type == 'random') {
        let lastUser;
        const randomIndex = Math.floor(Math.random() * users.length);
        lastUser = users[randomIndex];
        return lastUser;
      }
    }

    useEffect(() => {
      if (localStorage.getItem('UserProfile') === null) {
        localStorage.setItem('UserProfile', JSON.stringify({
          //default UserProfile
          gamesplayed: 0,
          gameslost: 0,
          gameswon: 0,
          pointsscored: 0,
          timeplayed: 0,
        }));
      } else {
        const lastUser = localStorage.getItem('CurrentUser');
        setLastLoggedInUser(lastUser);
      } if (localStorage.getItem('CurrentUser') === null) {
        localStorage.setItem('CurrentUser', currentUser);
      } if (localStorage.getItem('Game Behavior') === null) {
        localStorage.setItem('Game Behavior', JSON.stringify({
          matchtime: 30,
          pointstoscore: 25,
        }));
      } else { return; }
    }, []);

    return (
      <button onClick={() => { setUserPopup(true); }} className='userSelector'>
        {newLoggedInUser === null ? lastLoggedInUser : newLoggedInUser}
        <Icon icon='expand_more' />
      </button>
    );
  }
  const SelectUserBoxPopup = () => {
    function handleUserChange(user) {
      console.log(user)
      localStorage.setItem('CurrentUser', user);
      setNewLoggedInUser(user);
      setUserPopup(false);
      setCurrentUser(user);
    }

    return (
      <div style={UserPopup ? { display: 'flex' } : { display: 'none' }} className='selectUserBoxPopup'>
        {users.map((user, index) => (
          <button onClick={() => {
            handleUserChange(user);
          }}
            key={index}
            className='userSelector'
          >
            {user}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className='fullscreen welcome'>
      <h1 className='welcomeHeader'> Wolli <Icon icon={'sports_volleyball'} /> </h1>
      <UserSelecter />
      <StartButton />
      <SocialBox />
      <SettingsButton />
      <SelectUserBoxPopup />
    </div>
  );
}