import React, { ChangeEvent, useCallback, useState } from 'react';
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import Container from '../components/Container/Container';
import Modal from '../components/Modal/Modal';
import styles from '../styles/Mintable.module.css';
import { useDropzone } from 'react-dropzone';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import FailureModal from '../components/Modal/FailureModal';
import Image from "next/image";

const Mintable: React.FC = () => {

    const isWalletConnected = () => {
        const walletAddress = useAddress();
        return !!walletAddress;
    };

    const walletConnected = isWalletConnected();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const walletAddress = useAddress();
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            setImage(result);
        };

        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    const [showModal, setShowModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [showFailureModal, setShowFailureModal] = useState(false);
    const [createdNFT, setCreatedNFT] = useState({
        tokenId: null,
    });

    const [rows, setRows] = useState([]);

    const addRow = () => {
        // Yeni bir satır eklemek için mevcut satırları kopyala ve yeni bir satır ekleyerek ayarla
        setRows([...rows, { trait_type: '', value: '' }]);
    };

    const handleMint = async () => {
        try {
            setLoading(true);

            if (!image) {
                throw new Error('Image upload failure. Please add an image.');
            }

            if (!name) {
                throw new Error('Name is required. Please enter a name.');
            }

            if (!description) {
                throw new Error('Description is required. Please enter a description.');
            }

            const metadata = {
                name: name,
                description: description,
                image: image,
                // Trait verilerini metadata içine ekle
                attributes: [],
            };


            rows.forEach((row) => {
                metadata.attributes.push({
                    trait_type: row.trait_type,
                    value: row.value,
                });
            });

            const tx = await contract.erc721.mintTo(walletAddress, metadata);

            const { id: tokenId } = tx;

            const tokenIdAsString = tokenId.toString();

            setStatusMessage('NFT Created Successfully');
            setCreatedNFT({
                tokenId: tokenIdAsString,
            });
            setShowModal(true);
            setTimeout(() => {
                // Yönlendirme işlemi
                window.location.href = `/token/${NFT_COLLECTION_ADDRESS}/${tokenId}`;
            }, 5000);
        } catch (error) {
            console.error('MintTo işlemi sırasında bir hata oluştu:', error);

            setStatusMessage('Oops! Something went wrong!');
            setError(error.message || 'An unknown error occurred.'); // Hata mesajını state'e set et
            setShowFailureModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        // Modal'ı kapat
        setShowModal(false);
    };

    const handleCloseFailureModal = () => {
        // Modal'ı kapat
        setShowFailureModal(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add(styles.dragover);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove(styles.dragover);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove(styles.dragover);

        const file = e.dataTransfer.files[0];
        setImage(file);
    };

    const isValidImageType = (file: File): boolean => {
        const allowedImageTypes = ['image/png', 'image/gif', 'image/webp', 'image/jpeg'];

        // MIME tipini al
        const fileType = file.type;

        // Dosya uzantısını al
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // MIME tipi ve uzantıyı kontrol et
        return allowedImageTypes.includes(fileType) && allowedImageTypes.includes(`image/${fileExtension}`);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files && e.target.files[0];

            if (!file) {
                throw new Error('No file selected.');
            }

            // Dosya türünü ve uzantısını kontrol et
            if (!isValidImageType(file)) {
                throw new Error('Invalid file type. Please select a .png, .gif, .webp, .jpg, or .jpeg file.');
            }

            // Diğer işlemler...
        } catch (error) {
            console.error('Image upload failed:', error);
            alert(error.message || 'Upload failure. Please check the console for details.');
        }
    };

    return (
        <Container maxWidth="md">
            {walletConnected ? (
                <div className={styles.mainContainer}>
                    <h1 className={styles.title}>Create A NFT</h1>
                    <form className={styles.form}>
                        <div className={styles.container}>
                            <div className={styles.containerLeft}>
                                <div className={styles.leftColumn}>
                                    <label className={styles.label}>
                                        Name <br /><br />
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
                                    </label>
                                </div>
                                <div className={styles.leftColumn}>
                                    <label className={styles.label}>
                                        Description <br /><br />
                                        <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input2} />
                                    </label>
                                </div>
                            </div>
                            <div className={styles.containerRight}>
                                <div className={styles.rightColumn}>
                                    <div className={styles.fileUpload}>
                                        {image ? <div className={`${styles.fileUploads} ${styles.selectedFile}`}>
                                            <Image src={image instanceof File ? URL.createObjectURL(image) : image}
                                                width={150}
                                                height={150}
                                                alt="Background gradient from red to blue"
                                                quality={100}
                                                priority
                                            />
                                        </div> :
                                            <div
                                                {...getRootProps()}
                                                className={`${styles.fileUploads} ${styles.selectedFile} ${isDragActive ? styles.dragover : ''}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                Drag & Drop
                                                <p>or</p>
                                                <br />
                                                <input
                                                    type="image"
                                                    accept=".png, .gif, .webp, .jpg, .jpeg"
                                                    onChange={handleFileChange}
                                                    style={{ display: 'none' }}
                                                    {...getInputProps()}
                                                />
                                                <label
                                                    htmlFor="fileInput"
                                                    className={styles.selectButton}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}>
                                                    Select Image
                                                </label>
                                            </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ maxWidth: "100%" }}>
                            <h2>Properties</h2>
                            {/* Satırları haritala */}

                            {rows.map((row, index) => (
                                <div key={index} style={{ display: "flex", flexDirection: "row", padding: "5px" }}>
                                    <input
                                        className={styles.input}
                                        style={{ margin: "10px" }}
                                        name={`attributes.${index}.trait_type`}
                                        placeholder="trait_type"
                                        value={row.trait_type}
                                        onChange={(e) => {
                                            // Satırın "trait_type" değerini güncelle
                                            const updatedRows = [...rows];
                                            updatedRows[index].trait_type = e.target.value;
                                            setRows(updatedRows);
                                        }}
                                    />
                                    <input
                                        className={styles.input}
                                        style={{ margin: "10px" }}
                                        name={`attributes.${index}.value`}
                                        placeholder="value"
                                        value={row.value}
                                        onChange={(e) => {
                                            // Satırın "value" değerini güncelle
                                            const updatedRows = [...rows];
                                            updatedRows[index].value = e.target.value;
                                            setRows(updatedRows);
                                        }}
                                    />
                                    <button
                                        className={styles.selectButton}
                                        style={{ margin: "10px", backgroundColor: "red", float: "right" }}
                                        type="button"
                                        onClick={() => {
                                            // Satırı kaldır
                                            const updatedRows = [...rows];
                                            updatedRows.splice(index, 1);
                                            setRows(updatedRows);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {/* "Add Row" butonu */}
                            <button className={styles.selectButton} type="button" onClick={addRow}>
                                + Add Row
                            </button>
                        </div>
                        <div className={styles.button}>
                            <button type="button" onClick={handleMint} disabled={loading} className={styles.btn}>
                                {loading ? 'Creating.....' : 'Create A NFT'}
                            </button>
                        </div>
                        {showModal && createdNFT && (
                            <Modal tokenId={createdNFT.tokenId} onClose={handleCloseModal} />
                        )}
                        {showFailureModal && (
                            <FailureModal onClose={handleCloseFailureModal} error={error} />
                        )}
                    </form>
                </div>
            ) : (
                // Cüzdan bağlı değilse, ConnectWallet düğmesini göster
                <div className={styles.mainContainer2}>
                    <ConnectWallet
                        className={styles.walletConnectBtn}
                        theme="dark"
                        btnTitle="Connect Wallet"
                        hideTestnetFaucet={true}
                        switchToActiveChain={false}
                        welcomeScreen={{
                            title: "Welcome To MCT Marketplace",
                            subtitle: "This marketplace made with 💙 by Solazan for MCT Project",
                            img: {
                                src: "./_next/image?url=%2Fhero-asset.png&w=1080&q=100",
                                width: 300
                            },
                        }}
                    />
                </div>
            )}
        </Container>
    );
};

export default Mintable;
