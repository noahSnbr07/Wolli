import React, { useState } from 'react'
import '../../styles/settings.css';
import Icon from '../../config/Icon';
import { Link, json } from 'react-router-dom';
import Popup from '../../config/Popup';
export default function Settings() {
  const [popupState, setPopup] = useState({
    is: false,
    text: 'sample text',
    type: 'number',
    confirmed: false
  });

  function SettingsButton({ title, type, icon, description }) {

    function evaluateAction(title, type, description) {
      console.table(popupState);
      setPopup({ type: type, text: description, is: true });
    }

    return (
      <button onClick={() => { evaluateAction(title, type, description); }} className='settingsButton'>
        < Icon icon={icon} /> {title}
      </button>
    );

  }

  function handleClick(isTrue) {
    setPopup(prevState => ({ ...prevState, is: false, confirmed: isTrue }));

    if (popupState.text === 'Willst du deine Statistik wirklich zurücksetzen ?' && isTrue) {
      localStorage.setItem('UserProfile', JSON.stringify({
        gamesplayed: 0,
        gameslost: 0,
        gameswon: 0,
        pointsscored: 0,
        timeplayed: 0,
      }));
    } else if (popupState.text === 'Wird zum debuggen empfohlen' && isTrue) {
      localStorage.clear();
    } else if (popupState.text === 'Die Spielzeit eines Matches' && isTrue) {
      //TODO: number popup implememtation
    } else if (popupState.text === 'Die benötigte Punktzahl um ein Match zu gewinnen' && isTrue) {
      //TODO: number popup implememtation
    }
  }


  return (
    <div className='fullscreen settings'>
      <h1> Settings </h1>
      <div className='settings-container'>
        <SettingsButton description='Willst du deine Statistik wirklich zurücksetzen ?'
          type='boolean' title='Statistik reseten' />
        <SettingsButton description='Wird zum debuggen empfohlen'
          type='boolean' title='Speicher leeren' />
        <SettingsButton description='Die Spielzeit eines Matches'
          type='number' title='Spielzeit' />
        <SettingsButton description='Die benötigte Punktzahl um ein Match zu gewinnen'
          type='number' title='Punkteziel' />

        <button className='gotomainmenu'>
          <Link to='/'>
            <Icon icon='arrow_back' />
            Zurück
          </Link>
        </button>

        <Popup type={popupState.type}
          text={popupState.text}
          is={popupState.is}
          handleClick={handleClick} />

      </div>
    </div>
  );
}