import React, { useState, useEffect } from 'react';
import '../../styles/match.css';
import Icon from '../../config/Icon';

export default function Match() {
  const [active, setActiveBtn] = useState({ team: true, match: false });
  const [wonPopup, setWonPopup] = useState(false);
  const [matchBehavior, setMatchBehavior] = useState({});
  const [hasWon, setWon] = useState({ team1: false, team2: false });
  const [currentUser, setCurrentUser] = useState('');
  const [userProfile, setUserProfile] = useState({});
  const [isActive, setActive] = useState({ configuration: true, matchhost: false, });
  const [teams, setTeams] = useState({
    team1: { players: 0, score: 0 },
    team2: { players: 0, score: 0 },
  });

  useEffect(() => { //initialize teamconfiguration object in local storage
    localStorage.setItem('Team Configuration', JSON.stringify(teams));
  }, [teams, matchBehavior]);


  useEffect(() => {  //retrieve all neccessary items
    let retrievedObject = JSON.parse(localStorage.getItem('Game Behavior'));
    setMatchBehavior(retrievedObject);
    retrievedObject = localStorage.getItem('CurrentUser');
    setCurrentUser(retrievedObject);
    retrievedObject = JSON.parse(localStorage.getItem('UserProfile'));
    setUserProfile(retrievedObject);
  }, []);

  const convertToMinute = ((sec) => { return (sec * 60); });

  const [isRunning, setIsRunning] = useState(true);
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(convertToMinute(1));
  const [timerFinished, setTimerFinished] = useState(false);


  const Timer = React.memo(({ isRunning, timeRemaining, setIsMatchOver, checkWinByTime }) => {
    useEffect(() => {
      let interval;
      if (isRunning && timeRemaining > 0) {
        interval = setInterval(() => {
          setTimeRemaining((prevTime) => prevTime - 1);
        }, 1000);
      }
      if (isRunning && timeRemaining === 0) {
        setIsRunning(false);
        setTimerFinished(true);
        setIsMatchOver(true);
        clearInterval(interval);
        setIsMatchOver(true);
        setTimeRemaining(matchBehavior.matchtime);
        checkWinByTime();
      }
      return () => {
        clearInterval(interval);
      };
    }, [timeRemaining, setIsMatchOver, checkWinByTime, isRunning]);

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


  function Configuration() {
    function handleClick(ctx) {
      ctx === 'team'
        ? setActiveBtn((prevState) => ({ ...prevState, team: true, match: false }))
        : setActiveBtn((prevState) => ({ ...prevState, team: false, match: true }));
    }

    function TeamConfig() {
      function updateHeadstart(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState,
          [teamKey]: { ...prevState[teamKey], score: value },
        }));
      }

      function updatePlayerCount(teamKey, value) {
        setTeams((prevState) => ({
          ...prevState,
          [teamKey]: { ...prevState[teamKey], players: value },
        }));
      }

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
              onClick={() => updateHeadstart('team1', teams.team1.score + 1)}
              context='Vorsprung'
              value={teams.team1.score}
            />
          </div>
          <div className='teamconfigArea'>
            <NumberSelect
              onClick={() => updatePlayerCount('team2', teams.team2.players + 1)}
              context='Spieler'
              value={teams.team2.players}
            />
            <NumberSelect
              onClick={() => updateHeadstart('team2', teams.team2.score + 1)}
              context='Vorsprung'
              value={teams.team2.score}
            />
          </div>
        </div>
      );
    }

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
          <button onClick={() => { setActive({ configuration: false, matchhost: true }); }} className='startMatch'>
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
  //edit useres statistic based on match
  function resetStatistic() {
    const userProfileData = JSON.parse(localStorage.getItem('UserProfile'));
    let updatedUserProfile;
    if (hasWon.team1) {
      updatedUserProfile = {
        ...userProfileData,
        gameswon: userProfileData.gameswon + 1,
        gamesplayed: userProfileData.gamesplayed + 1,
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    }
    if (hasWon.team2) {
      updatedUserProfile = {
        ...userProfileData,
        gameslost: userProfileData.gameslost + 1,
        gamesplayed: userProfileData.gamesplayed + 1,
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    }
    localStorage.setItem('UserProfile', JSON.stringify(updatedUserProfile));
  }


  function endMatch() {
    setActive({ configuration: true, matchhost: false });
    setWonPopup(false);
    setTeams({
      team1: { players: 0, score: 0 },
      team2: { players: 0, score: 0 },
    });
    resetStatistic();

    setIsRunning(true);
    setIsMatchOver(false);
    setTimerFinished(false);
    setTimeRemaining(convertToMinute(1));
    setWon({ team1: false, team2: false });
  }

  function WinnerDisplay() {
    return (
      <div className='wonscreen'>
        <h1> Der Sieger ist {hasWon.team1 ? 'Team 1' : 'Team 2'} mit {teams.team1.score} Punkten </h1>
        <button onClick={() => { endMatch(); }} className='endMatch'> Okay <Icon icon='logout' /> </button>
      </div>
    );
  }

  function resetStatisticByTime(teamWhichWon) {
    const userProfileData = JSON.parse(localStorage.getItem('UserProfile'));
    let updatedUserProfile = {};
    if (teamWhichWon === 'team1') {
      updatedUserProfile = {
        ...userProfileData,
        gameswon: userProfileData.gameswon + 1,
        gamesplayed: userProfileData.gamesplayed + 1,
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    } else if (teamWhichWon === 'team2') {
      updatedUserProfile = {
        ...userProfileData,
        gameslost: userProfileData.gameslost + 1,
        gamesplayed: userProfileData.gamesplayed + 1,
        timeplayed: userProfileData.timeplayed + matchBehavior.matchtime,
      };
    }
    localStorage.setItem('UserProfile', JSON.stringify(updatedUserProfile));
  }

  //the function wher everything for a going match is
  function Matchhost() {
    const [isLeading, setLeading] = useState({ team1: false, team2: false });

    function setTeamsScore(operation, team) {
      if (operation === 'increase') {
        setTeams((prevState) => ({
          ...prevState,
          [team]: { ...prevState[team], score: prevState[team].score + 1 },
        }));
      } else if (operation === 'decrease') {
        setTeams((prevState) => ({
          ...prevState,
          [team]: { ...prevState[team], score: prevState[team].score - 1 },
        }));
      }
    }

    //checks and marks the leading team visually
    function checkLeader() {
      if (wonPopup) { return; }
      else {
        const team1Score = teams.team1.score;
        const team2Score = teams.team2.score;

        if (team1Score > team2Score) {
          setLeading({ team1: true, team2: false });
        } else if (team2Score > team1Score) {
          setLeading({ team1: false, team2: true });
        } else {
          setLeading({ team1: false, team2: false });
        }

        if (team1Score >= matchBehavior.pointstoscore) {
          setWon({ team1: true, team2: false });
          setWonPopup(true);
        } else if (team2Score >= matchBehavior.pointstoscore) {
          setWon({ team1: false, team2: true });
          setWonPopup(true);
        }
      }
    }

    function checkWinByTime() {
      const team1Score = teams.team1.score;
      const team2Score = teams.team2.score;
      if (team1Score >= matchBehavior.pointstoscore) {
        setWon({ team1: true, team2: false });
        setWonPopup(true);
        resetStatisticByTime('team1'); // Call resetStatisticByTime here when team 1 wins
      } else if (team2Score >= matchBehavior.pointstoscore) {
        setWon({ team1: false, team2: true });
        setWonPopup(true);
        resetStatisticByTime('team2'); // Call resetStatisticByTime here when team 2 wins
      }
    }
    useEffect(() => {
      checkLeader();
    }, [teams]);

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
          <>
            <TeamContainer
              name='Mein Team'
              leader={isLeading.team1 ? 'In Führung' : ''}
              style={isLeading.team1 ? { boxShadow: 'inset 0px 0px 25px var(--accent)' } : {}}
              player={teams.team1.players}
              scoreContext={teams.team1.score}
              team='team1'
            />

            <TeamContainer
              name='Gegner'
              leader={isLeading.team2 ? 'In Führung' : ''}
              style={isLeading.team2 ? { boxShadow: 'inset 0px 0px 25px var(--accent)' } : {}}
              player={teams.team2.players}
              scoreContext={teams.team2.score}
              team='team2'
            />
            <div className='match-overview'>
              <Timer
                timeRemaining={timeRemaining}
                setIsMatchOver={setIsMatchOver}
                checkWinByTime={checkWinByTime}
                isRunning={isRunning}
                resetStatisticByTime={resetStatisticByTime}
              />
              <div className='info-ratio'>
                <h1> {teams.team1.players} </h1>
                <h1> vs </h1>
                <h1> {teams.team2.players} </h1>
              </div>
              <div className='info-user'>
                <h1> {currentUser} </h1>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }


  return (
    <div className='match'>
      <main className='match-main'>
        {isActive.configuration ? <Configuration /> : isActive.matchhost ? <Matchhost /> : null}
      </main>
      {wonPopup ? <WinnerDisplay /> : null}
    </div>
  );
}