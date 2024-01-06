import React from 'react';
import styles from '../styles/MicIcon.module.css';
import mic from '../images/microphone-icon.png'


const MicIcon = ({ recording }) => {
    return (
        <div className={styles.waveformContainer}>
            <img src={mic} alt="Microphone" className={styles.microphoneIcon} />
        </div>
    );
};

export default MicIcon;
