import React from 'react';
import '../../styles/history.css';

export default function History() {
 const [history, setHistory] = React.useState({});

 React.useEffect(() => {
  let retrieved = JSON.parse(localStorage.getItem('MatchHistory'));
  setHistory(retrieved);
 }, []);

 const Match = ({ wonLoss, myTeamScore, enemyScore, matchLength }) => {
  return (
   <div style={wonLoss === 'Sieg' ? { backgroundColor: 'rgba(0, 255, 0, 0.1 )' } : { backgroundColor: 'rgba(255, 0, 0, 0.1 )' }} className='previous-match'>
    <h1>{wonLoss}</h1>
    <h1>{myTeamScore} : {enemyScore}</h1>
    <h1>{matchLength}</h1>
   </div>
  );
 };

 return (
  <div className='history'>
   <h1 className='header'>Verlauf</h1>
   <div className='mappedMatches'>
    {Object.values(history).map((matches, index) => (
     <div key={index}>
      {matches.map((match, matchIndex) => (
       <Match
        key={matchIndex}
        wonLoss={match.WonOrLoss}
        myTeamScore={match.myteamScore}
        enemyScore={match.enemyScore}
        matchLength={match.length}
       />
      ))}
     </div>
    ))}
   </div>
  </div>
 );
}
