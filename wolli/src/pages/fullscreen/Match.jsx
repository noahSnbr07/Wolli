import React, { useState, useEffect } from 'react'
import '../../styles/match.css';
import Icon from '../../config/Icon';
export default function Match() {
  const [active, setActiveBtn] = useState({ team: true, match: false });
  const [defaultSettings, setDefaultSettings] = useState({});
  //toggle betwenn components
  const [isActive, setActive] = useState({
    configuration: true,
    matchhost: false,
  });
  //teams object to keep track
  const [teams, setTeams] = useState({
    team1: { players: 0, start: 0, headstart: 0, score: 0 },
    team2: { players: 0, start: 0, headstart: 0, score: 0 },
  });
  const [matchBehavior, setMatchBehavior] = useState({});

  //if the values change reset them to localStorage
  useEffect(() => {
    localStorage.setItem('Team Configuration', JSON.stringify(teams));
  }, [teams, matchBehavior]);

  //retrieve localStorage Settings and default apply them
  useEffect(() => {
    let retrievedObject = JSON.parse(localStorage.getItem('Game Behavior'));
    setDefaultSettings(retrievedObject);
    retrievedObject = JSON.parse(localStorage.getItem('Game Behavior'));
    setMatchBehavior(retrievedObject);
  }, []);

  //component toggler function
  function Configuration() {
    function handleClick(ctx) {
      ctx === 'team'
        ? setActiveBtn((prevState) => ({ ...prevState, team: true, match: false }))
        : setActiveBtn((prevState) => ({ ...prevState, team: false, match: true }));
    }
    //function to edit teams headstart values
    function TeamConfig() {
      function updateHeadstart(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState,
          [teamKey]: { ...prevState[teamKey], headstart: value },
        }));
      }
      //function to edit teams player values
      function updatePlayerCount(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState,
          [teamKey]: { ...prevState[teamKey], players: value },
        }));
      }
      //valuable  values in config component
      function NumberSelect({ context, value, onClick }) {
        return (
          <div className='numberselect'>
            <div className='numberselect-div'>
              <h1> {context} </h1>
            </div>
            <div className='numberselect-div'>
              <button onClick={onClick}> + </button>
              <span> {value} </span>
              <button onClick={onClick}> - </button>
            </div>
          </div>
        );
      }

      return (
        <div className='team-config'>
          <div className='teamconfigArea'>
            <NumberSelect
              onClick={() => updatePlayerCount('team1', teams.team1.players + 1)}
              context='Spieler'
              value={teams.team1.players}
            />
            <NumberSelect
              onClick={() => updateHeadstart('team1', teams.team1.headstart + 1)}
              context='Vorsprung'
              value={teams.team1.headstart}
            />
          </div>
          <div className='teamconfigArea'>
            <NumberSelect
              onClick={() => updatePlayerCount('team2', teams.team2.players + 1)}
              context='Spieler'
              value={teams.team2.players}
            />
            <NumberSelect
              onClick={() => updateHeadstart('team2', teams.team2.headstart + 1)}
              context='Vorsprung'
              value={teams.team2.headstart}
            />
          </div>
        </div>
      );
    }

    //second config component for matchbehavior
    function MatchConfig() {
      return (
        <div className='match-config'>
          <h1> Regelwerk </h1>
          <div className='match-con-container'>
            <section style={{ width: '40%' }}>
              <h2> Punkteziel </h2>
            </section>
            <section style={{ width: '60%' }}>
              <button onClick={() => setMatchBehavior(prevState => ({ ...prevState, pointstoscore: prevState.pointstoscore + 1 }))}> + </button>
              <span> {matchBehavior.pointstoscore} </span>
              <button onClick={() => setMatchBehavior(prevState => ({ ...prevState, pointstoscore: prevState.pointstoscore - 1 }))}> - </button>
            </section>
          </div>
          <div className='match-con-container'>
            <section style={{ width: '40%' }}>
              <h2> Spielzeit </h2>
            </section>
            <section style={{ width: '60%' }}>
              <button onClick={() => setMatchBehavior(prevState => ({ ...prevState, matchtime: prevState.matchtime + 1 }))}> + </button>
              <span> {matchBehavior.matchtime} </span>
              <button onClick={() => setMatchBehavior(prevState => ({ ...prevState, matchtime: prevState.matchtime - 1 }))}> - </button>
            </section>
          </div>
          <button onClick={() => { setActive({ configuration: false, matchhost: true }) }} className='startMatch'>
            <Icon icon='sports' />
          </button>
        </div>
      );
    }

    return (
      <div className='configuration'>
        <nav className='config-nav'>
          <button
            onClick={() => { handleClick('team'); }}
            className={active.team ? 'btn-active' : 'config-nav-btn'}
          >
            <Icon icon='group' /> Team
          </button>
          <button
            onClick={() => { handleClick('match'); }}
            className={active.match ? 'btn-active' : 'config-nav-btn'}
          >
            <Icon icon='settings' /> Match
          </button>
        </nav>
        <main className='match-config-area'>
          {active.match ? <MatchConfig /> : <TeamConfig />}
        </main>
      </div>
    );
  }

  //function to host a local match
  function Matchhost() {
    return (
      <div className='matchhost fullscreen'>
      </div>
    );
  }

  return (
    <div className='match'>
      <main className='match-main'>
        {isActive.configuration ? <Configuration /> :
          isActive.matchhost ? <Matchhost /> :
            console.error('')}
      </main>
    </div>
  );
}