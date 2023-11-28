import React from 'react';
import Styles from './Modal.module.css';
import { ThirdwebNftMedia, useContract, useNFT } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from '../../const/contractAddresses';




const Modal = ({ tokenId, onClose }) => {


    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    // Load the NFT metadata from the contract using a hook
    const { data: nft, isLoading, error } = useNFT(contract, tokenId);

    if (isLoading) return <div>Loading...</div>;
    if (error || !nft) return <div>NFT not found</div>;
    return (
        <div className={Styles.modal}>
            <div className={Styles.modalContent}>
            <div className={Styles.btn} onClick={onClose}>X</div>
                <h2>NFT Created Successfully</h2>
                <p>Token ID: #{tokenId}</p>
                <ThirdwebNftMedia metadata={nft.metadata} />
            </div>
        </div>
    );
};

export default Modal;
