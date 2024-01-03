import React from 'react';
import styles from '../styles/MicIcon.module.css';
import mic from './images/microphone-icon.png'


const MicIcon = ({ recording }) => {
    return (
        <div className={styles.waveformContainer}>
            <img src={mic} alt="Microphone" className={styles.microphoneIcon} />
            <div className={styles.waveformBars}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className={`${styles.bar} ${recording ? styles.active : ''}`}></div>
                ))}
            </div>
        </div>
    );
};

export default MicIcon;
