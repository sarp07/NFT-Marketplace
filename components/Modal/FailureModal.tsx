import React from 'react';
import styles from './FailureModal.module.css';

interface ModalProps {
    onClose: () => void;
    error: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, error }) => {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className={styles.modalHeader}>
                    <h2>ERROR :</h2>
                </div>
                <br />
                <div className={styles.modalBody}>
                    <p>Permissions or Transactions error! <br /> There was an error while creating the NFT. Please try again later.</p>
                </div>
                <br />
                <br />
                <br />
                <br />
            </div>
        </div>
    );
};

export default Modal;