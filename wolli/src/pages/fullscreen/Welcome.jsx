import React, { useEffect, useState } from 'react'
import '../../styles/welcome.css';
import Github from '../../icons/github.png';
import Instagram from '../../icons/instagram.png';
import Reddit from '../../icons/reddit.png';
import Icon from '../../config/Icon.jsx';
export default function Welcome() {
  const [users, setUsers] = useState(['noah', 'max', 'jannis', 'lina']);
  const [UserPopup, setUserPopup] = useState(false);
  const [newLoggedInUser, setNewLoggedInUser] = useState(null);
  const StartButton = () => {
    return (
      <buttons className='startButton'>
        Start
      </buttons>
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
      <button className='settingsButton'>
        Einstellungen
      </button>
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
          pointsscored: 0,
          timeplayed: 0,
          gameswon: 0,
          gameslost: 0,
          userProfile: selectLastUser('random'),
        }));
      } else {
        const retrievedUserProfile = JSON.parse(localStorage.getItem('UserProfile'));
        const lastUser = retrievedUserProfile.userProfile;
        setLastLoggedInUser(lastUser);
      }
    }, []);

    return (
      <button onClick={() => { setUserPopup(true); }} className='userSelector'>
        {newLoggedInUser === null ? lastLoggedInUser : newLoggedInUser}
        <Icon icon='expand_more' />
      </button>
    );
  }

  const SelectUserBoxPopup = () => {
    return (
      <div style={UserPopup ? { display: 'flex' } : { display: 'none' }} className='selectUserBoxPopup'>
        {users.map((user, index) => (
          <button onClick={() => {
            setUserPopup(false);
            setNewLoggedInUser(user);
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