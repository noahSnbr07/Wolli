import React from 'react'
import '../../styles/statistic.css';
import { Link } from 'react-router-dom';
import Icon from '../../config/Icon';
export default function Statistic() {
  const [retrievedProfile, setRetrievedProfile] = React.useState({});
  React.useEffect(() => {
    let retrieved = JSON.parse(localStorage.getItem('UserProfile'));
    setRetrievedProfile(retrieved);
  }, []);

  const formatRatio = () => {
    const gamesWon = retrievedProfile.gameswon;
    const gamesLost = retrievedProfile.gameslost;

    if (gamesLost === 0) {
      return "N/A";
    }

    const gcd = (a, b) => {
      if (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    };

    const ratioGcd = gcd(gamesWon, gamesLost);
    const simplifiedGamesWon = gamesWon / ratioGcd;
    const simplifiedGamesLost = gamesLost / ratioGcd;

    return `${simplifiedGamesWon}/${simplifiedGamesLost}`;
  };

  function winChance() {
    const gamesWon = retrievedProfile.gameswon;
    const gamesLost = retrievedProfile.gameslost;

    if (gamesWon === 0 && gamesLost === 0) {
      return "N/A";
    }

    const winPercentage = (gamesWon / (gamesWon + gamesLost)) * 100;
    return `${winPercentage.toFixed(1)}%`;
  }


  function CareerStatistic({ name, value }) {
    if (value === "N/A") {
      return (
        <div className='career-stat'>
          <h1> {name} </h1>
          <h1> {value} </h1>
        </div>
      );
    }

    return (
      <div className='career-stat'>
        <h1> {name} </h1>
        <h1> {value}</h1>
      </div>
    );
  }
  return (
    <div className='statistic'>
      <h1> Statistik </h1>
      <section className="career">
        <CareerStatistic name='Spiele gespielt' value={retrievedProfile.gamesplayed} />
        <CareerStatistic name='Spiele gewonnen' value={retrievedProfile.gameswon} />
        <CareerStatistic name='Spiele verloren' value={retrievedProfile.gameslost} />
        <CareerStatistic name='Punkte erzielt' value={retrievedProfile.pointsscored} />
        <CareerStatistic name='S/N-Verhältnis' value={formatRatio()} />
        <CareerStatistic name='Siegesrate' value={winChance()} />
        <CareerStatistic name='Zeit gespielt' value={retrievedProfile.timeplayed} />
        <button className='backtomain1'>
          <Link to={'/main'}> <Icon icon='home' /> </Link>
        </button>
      </section>
    </div>
  );
}