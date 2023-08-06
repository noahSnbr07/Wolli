import React, { useState, useEffect, Fragment } from 'react';
import '../../styles/match.css';
import Icon from '../../config/Icon';
import { Link } from 'react-router-dom';

export default function Match() {
  const [active, setActiveBtn] = useState({ team: true, match: false });
  const [wonPopup, setWonPopup] = useState(false);
  const [matchBehavior, setMatchBehavior] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [history, setHistory] = useState({});
  const [hasWon, setWon] = useState({ team1: false, team2: false });
  const [currentUser, setCurrentUser] = useState('');
  const [isActive, setActive] = useState({ configuration: true, matchhost: false, });
  const [teams, setTeams] = useState({
    team1: { players: 0, score: 0 }, team2: { players: 0, score: 0 },
  });

  //reset configuration settings onchnage in settings
  useEffect(() => {
    localStorage.setItem('Team Configuration', JSON.stringify(teams));
  }, [teams, matchBehavior]);

  //retrive important localStorage values
  useEffect(() => {
    let retrievedObject = JSON.parse(localStorage.getItem('Game Behavior'));
    setMatchBehavior(retrievedObject);
    retrievedObject = localStorage.getItem('CurrentUser');
    setCurrentUser(retrievedObject);
    retrievedObject = JSON.parse(localStorage.getItem('UserProfile'));
    setUserProfile(retrievedObject);
    retrievedObject = JSON.parse(localStorage.getItem('MatchHistory'));

  }, []);

  //display as minutes
  const convertToMinute = ((sec) => { return (sec * 60); });

  const [isRunning, setIsRunning] = useState(true);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(convertToMinute(1));
  const [timerFinished, setTimerFinished] = useState(false);

  //timer to keep track of timing rules
  const Timer = React.memo(({ isRunning, timeRemaining, setIsMatchOver, checkWinByTime }) => {
    useEffect(() => {
      let interval;
      if (isRunning && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);
      }
      if (isRunning && timeRemaining === 0) {
        //reset timer
        setIsRunning(false);
        setTimerFinished(true);
        clearInterval(interval);
        setTimeRemaining(matchBehavior.matchtime);
        //set data
        checkWinByTime();
        setIsMatchOver(true);
      }
      return () => {
        clearInterval(interval);
      };
    }, [timeRemaining, setIsMatchOver, checkWinByTime, isRunning]);

    //format e.g 300 secs to 05:00 min
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div className="info-time">
        <div>{formatTime(timeRemaining)}</div>
      </div>
    );
  });

  //set teams players headstart values
  function Configuration() {
    function handleClick(ctx) { ctx === 'team' ? setActiveBtn((prevState) => ({ ...prevState, team: true, match: false })) : setActiveBtn((prevState) => ({ ...prevState, team: false, match: true })); }

    function TeamConfig() {
      function updateHeadstart(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState, [teamKey]: { ...prevState[teamKey], score: value },
        }));
      }

      function updatePlayerCount(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState, [teamKey]: { ...prevState[teamKey], players: value },
        }));
      }

      //component to change values of numbers
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
              value={teams.team1.players} /> <NumberSelect
              onClick={() => updateHeadstart('team1', teams.team1.score + 1)}
              context='Vorsprung'
              value={teams.team1.score} />
          </div> <div className='teamconfigArea'>
            <NumberSelect
              onClick={() => updatePlayerCount('team2', teams.team2.players + 1)}
              context='Spieler'
              value={teams.team2.players} /> <NumberSelect
              onClick={() => updateHeadstart('team2', teams.team2.score + 1)}
              context='Vorsprung'
              value={teams.team2.score} />
          </div>
        </div>
      );
    }

    //match behavior settingsconfiguration component
    function MatchConfig() {
      return (
        <div className='match-config'>
          <h1 style={{ height: '10%' }}> Regelwerk </h1>
          <div className='fra'>
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
          </div>
          <div className='fra'>
            <button onClick={() => { setActive({ configuration: false, matchhost: true }); }} className='startMatch'>
              <Icon icon='sports' />
            </button>
            <button className='backtomain2'>
              <Link to={'/main'}> <Icon icon='home' /> </Link>
            </button>
          </div>
        </div >
      );
    }

    return (
      <div className='configuration'>
        <nav className='config-nav'>
          <button
            onClick={() => { handleClick('team'); }}
            className={active.team ? 'btn-active' : 'config-nav-btn'}  > <Icon icon='group' /> Team
          </button>
          <button
            onClick={() => { handleClick('match'); }}
            className={active.match ? 'btn-active' : 'config-nav-btn'} > <Icon icon='settings' /> Match
          </button>
        </nav>
        <main className='match-config-area'> {active.match ? <MatchConfig /> : <TeamConfig />}  </main>
      </div>
    );
  }

  function callHistory() {
    const existingHistory = JSON.parse(localStorage.getItem('MatchHistory')) || {};

    const matchSummary = {
      WonOrLoss: null,
      enemyScore: teams.team2.score,
      myteamScore: teams.team1.score,
      length: matchBehavior.matchtime,
    };

    if (hasWon.team1) {
      matchSummary.WonOrLoss = 'Sieg';
    } else if (hasWon.team2) {
      matchSummary.WonOrLoss = 'Niederlage';
    }

    const currentUserHistory = existingHistory[currentUser] || [];
    currentUserHistory.push(matchSummary);
    existingHistory[currentUser] = currentUserHistory;

    localStorage.setItem('MatchHistory', JSON.stringify(existingHistory));
  }


  //edit useres statistic based on match
  function resetStatistic() {
    const userProfileData = JSON.parse(localStorage.getItem('UserProfile'));
    let updatedUserProfile;
    if (hasWon.team1) {
      updatedUserProfile = {
        ...userProfileData,
        gamesplayed: userProfileData.gamesplayed + 1,
        gameswon: userProfileData.gameswon + 1,
        gameslost: userProfileData.gameslost,
        pointsscored: userProfileData.pointsscored + (teams.team1.score),
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    }
    if (hasWon.team2) {
      updatedUserProfile = {
        ...userProfileData,
        gamesplayed: userProfileData.gamesplayed + 1,
        gameswon: userProfileData.gameswon,
        gameslost: userProfileData.gameslost + 1,
        pointsscored: userProfileData.pointsscored,
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    } else if (!hasWon.team1 && !hasWon.team2) {
      return;
    }
    localStorage.setItem('UserProfile', JSON.stringify(updatedUserProfile));
  }
  //reinitialize timer and reset values to start next match
  function endMatch() {
    setActive({ configuration: true, matchhost: false });
    setWonPopup(false);
    setTeams({ team1: { players: 0, score: 0 }, team2: { players: 0, score: 0 } });
    setIsRunning(true);
    setIsMatchOver(false);
    setTimerFinished(false);
    setTimeRemaining(convertToMinute(1));
    setWon({ team1: false, team2: false });
    resetStatistic();
    callHistory();
  }
  //little popup to show win of team
  function WinnerDisplay() {
    return (
      <div className='wonscreen'>
        <h1> Der Sieger ist {hasWon.team1 ? 'Team 1' : 'Team 2'} mit {teams.team1.score} Punkten </h1>
        <button onClick={() => { endMatch(); }} className='endMatch'> Okay <Icon icon='logout' /> </button>
      </div>
    );
  }

  //the function wher everything for a going match is
  function Matchhost() {
    const [isLeading, setLeading] = useState({ team1: false, team2: false });

    function setTeamsScore(operation, team) {
      if (operation === 'increase') {
        setTeams((prevState) => ({
          ...prevState, [team]: { ...prevState[team], score: prevState[team].score + 1 },
        }));
      } else if (operation === 'decrease') {
        setTeams((prevState) => ({
          ...prevState, [team]: { ...prevState[team], score: prevState[team].score - 1 },
        }));
      }
    }

    //marks leading team visually with a red inset shadow
    function checkLeader() {
      if (wonPopup) { return; }
      else {
        if (teams.team1.score > teams.team2.score) { setLeading({ team1: true, team2: false }); }
        else if (teams.team2.score > teams.team1.score) { setLeading({ team1: false, team2: true }); }
        else { setLeading({ team1: false, team2: false }); }

        if (teams.team1.score >= matchBehavior.pointstoscore) {
          setWon({ team1: true, team2: false });
          setWonPopup(true);
        } else if (teams.team2.score >= matchBehavior.pointstoscore) {
          setWon({ team1: false, team2: true });
          setWonPopup(true);
        }
      }
    }

    //set winner by time (doesnt count as win)
    function checkWinByTime() {
      if (teams.team1.score >= matchBehavior.pointstoscore) {
        setWon({ team1: true, team2: false });
        setWonPopup(true);
      } else if (teams.team2.score >= matchBehavior.pointstoscore) {
        setWon({ team1: false, team2: true });
        setWonPopup(true);
      }
    }

    //chck for new leader each time a team scores
    useEffect(() => {
      checkLeader();
    }, [teams]);

    //2 teams component 
    const TeamContainer = ({ scoreContext, team, player, leader, style, name }) => {
      return (
        <div style={style} className="team-container">
          <section >
            <h1 className='team-name'> {name} </h1>
            <h3> Spieler: {player} </h3>
            <h2 className='leaderinfo'> {leader} </h2>
          </section>
          <section >
            <button onClick={(e) => { if (e.isTrusted) setTeamsScore('increase', team); checkLeader(); }}> + </button>
            <span> {scoreContext} </span>
            <button onClick={(e) => { if (e.isTrusted) setTeamsScore('decrease', team); checkLeader(); }}> - </button>
          </section>
        </div >
      );
    };

    return (
      <div className='matchhost fullscreen'>
        {isMatchOver ? (
          <div className="won-popup">
            <h1>Time is up! The winner is {hasWon.team1 ? 'Team 1' : 'Team 2'} with {teams.team1.score} points.</h1>
            <button onClick={() => endMatch()}>Okay</button>
          </div>
        ) : wonPopup ? (
          <div className="won-popup">
            <h1>Match has ended. The winner is {hasWon.team1 ? 'Team 1' : 'Team 2'} with {teams.team1.score} points.</h1>
            <button onClick={() => endMatch()}>Okay</button>
          </div>
        ) : (
          <Fragment>
            <TeamContainer
              name='Mein Team'
              leader={isLeading.team1 ? 'In Führung' : ''}
              style={isLeading.team1 ? { boxShadow: 'inset 0px 0px 25px var(--accent)' } : {}}
              player={teams.team1.players}
              scoreContext={teams.team1.score}
              team='team1' />
            <TeamContainer
              name='Gegner'
              leader={isLeading.team2 ? 'In Führung' : ''}
              style={isLeading.team2 ? { boxShadow: 'inset 0px 0px 25px var(--accent)' } : {}}
              player={teams.team2.players}
              scoreContext={teams.team2.score}
              team='team2' />
            <div className='match-overview'>
              <Timer
                timeRemaining={timeRemaining}
                setIsMatchOver={setIsMatchOver}
                checkWinByTime={checkWinByTime}
                isRunning={isRunning} />
              <div className='info-ratio'>
                <h1> {teams.team1.players} </h1>
                <h1> vs </h1>
                <h1> {teams.team2.players} </h1>
              </div>
              <div className='info-user'>
                <h1> {currentUser} </h1>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }

  //main returnment statement
  return (
    <div className='match'>
      <main className='match-main'>
        {isActive.configuration ? <Configuration /> : isActive.matchhost ? <Matchhost /> : null}
      </main>
      {wonPopup ? <WinnerDisplay /> : null}
    </div>
  );
}