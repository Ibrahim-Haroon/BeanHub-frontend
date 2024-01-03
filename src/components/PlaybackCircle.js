import React from 'react';
import styles from '../styles/PlaybackCircle.module.css'

const PlaybackCircle = ({ playing }) => {
    return (
        <div className={`playback-circle ${playing ? 'playing' : ''}`}></div>
    );
};

export default PlaybackCircle;
