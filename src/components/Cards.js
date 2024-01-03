import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>

      <h1>TESTIMONIALS</h1>

      <h1>Check out these EPIC Destinations!</h1>

      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem // CHANGE THESE
              src='./images/logo.png' 
              text='See How BeanHub Can Optimize Your Customer Service'
              path='/try-beanhub'
            />
            <CardItem
              src='../images/logo.png'
              text='Meet the Brains Behind BeanHub'
              path='/about-us'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;