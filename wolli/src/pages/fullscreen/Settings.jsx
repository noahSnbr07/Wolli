import React, { useState, useEffect } from 'react';
import '../../styles/settings.css';
import Icon from '../../config/Icon';
import { Link } from 'react-router-dom';
import '../../config/config.css';

export default function Settings() {
  const [storageData, setStorageData] = useState({});
  const [storedGameBehavior, setStoredGameBehavior] = useState({});
  const [editedValue, setEditedValue] = useState(0); // New state for the edited value

  useEffect(() => {
    const retrieved = JSON.parse(localStorage.getItem('UserProfile'));
    setStorageData(retrieved);

    const retr_settings = JSON.parse(localStorage.getItem('Game Behavior'));
    setStoredGameBehavior(retr_settings);
  }, []);

  const [popupState, setPopup] = useState({
    is: false,
    text: 'sample text',
    type: 'number',
    confirmed: false,
    initial: 0,
  });

  function SettingsButton({ title, type, icon, description }) {
    function evaluateAction(title, type, description) {
      console.table(popupState);
      // Use the storedGameBehavior value for the initial state of the number popup
      if (type === 'number') {
        setPopup({ type: type, text: description, is: true, initial: storedGameBehavior[description.toLowerCase()] });
      } else {
        setPopup({ type: type, text: description, is: true });
      }
    }

    return (
      <button onClick={() => evaluateAction(title, type, description)} className='settingsButton'>
        <Icon icon={icon} /> {title}
      </button>
    );
  }

  function handleClick(isTrue) {
    if (isTrue === 'close') {
      setPopup(prevState => ({ ...prevState, is: false }));
      if (popupState.text === 'Die Spielzeit eines Matches') {
        const updatedGameBehavior = { ...storedGameBehavior, matchtime: editedValue };
        localStorage.setItem('Game Behavior', JSON.stringify(updatedGameBehavior));
        setStoredGameBehavior(updatedGameBehavior);
      } if (popupState.text === 'Die benötigte Punktzahl um ein Match zu gewinnen') {
        const updatedGameBehavior = { ...storedGameBehavior, pointstoscore: editedValue };
        localStorage.setItem('Game Behavior', JSON.stringify(updatedGameBehavior));
        setStoredGameBehavior(updatedGameBehavior);
      }
    } else {
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
        // TODO: number popup implementation
      } else if (popupState.text === 'Die benötigte Punktzahl um ein Match zu gewinnen' && isTrue) {
        // TODO: number popup implementation
      }
    }
  }

  function handleCount(operator) {
    if (operator === 'increment') {
      setEditedValue(prevValue => prevValue + 1);
    } else if (operator === 'decrement') {
      setEditedValue(prevValue => prevValue - 1);
    } else {
      console.error('Invalid Operation in popup');
    }
  }

  function Popup() {
    return (
      <div className='popup' style={popupState.is ? { display: 'flex' } : { display: 'none' }}>
        <h1> {popupState.text} </h1>
        {popupState.type === 'number' ? (
          <div className='popupNumWrapper'>
            <div className='popupOptionsNum'>
              <button onClick={() => { handleCount('increment') }} className='popupOptionNum'> + </button>
              <h1> {editedValue} </h1> {/* Use the editedValue state */}
              <button onClick={() => { handleCount('decrement') }} className='popupOptionNum'> - </button>
            </div>
            <button onClick={() => handleClick('close')} className='popupSave'>
              <Icon icon='save' />
            </button>
          </div>
        ) : popupState.type === 'boolean' ? (
          <div className='popupOptions'>
            <button onClick={() => handleClick(true)} style={{ background: 'var(--accent)' }}>
              <Icon icon='check' />
            </button>
            <button onClick={() => handleClick(false)} style={{ background: 'var(--bg-2)' }}>
              <Icon icon='close' />
            </button>
          </div>
        ) : (
          console.error('Invalid parameter')
        )}
      </div>
    );
  }

  return (
    <div className='fullscreen settings'>
      <h1> Settings </h1>
      <div className='settings-container'>
        <SettingsButton description='Willst du deine Statistik wirklich zurücksetzen ?' type='boolean' title='Statistik zurücksetzen' />
        <SettingsButton description='Wird zum Debuggen empfohlen' type='boolean' title='Speicher leeren' />
        <SettingsButton description='Die Spielzeit eines Matches' type='number' title='Spielzeit' />
        <SettingsButton description='Die benötigte Punktzahl um ein Match zu gewinnen' type='number' title='Punkteziel' />

        <button className='gotomainmenu'>
          <Link to='/'>
            <Icon icon='arrow_back' />
            Zurück
          </Link>
        </button>

        <Popup
          type={popupState.type}
          text={popupState.text}
          is={popupState.is}
          handleClick={handleClick}
        />
      </div>
    </div>
  );
}
