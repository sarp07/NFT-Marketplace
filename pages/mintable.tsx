import React, { ChangeEvent, useCallback, useState } from 'react';
import { useAddress, useContract, walletConnect } from "@thirdweb-dev/react";
import Container from '../components/Container/Container';
import Modal from '../components/Modal/Modal';
import styles from '../styles/Mintable.module.css';
import { useDropzone, FileRejection, DropzoneOptions } from 'react-dropzone';
import { NFT_COLLECTION_ADDRESS } from '../const/contractAddresses';
import FailureModal from '../components/Modal/FailureModal';
import Image from "next/image";
import path from 'path';

interface Metadata {
    name: string;
    description: string;
    image: string | null;
    attributes: Array<{ trait_type: string; value: string }>;
}

const Mintable: React.FC = () => {

    const walletAddress = useAddress();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<any | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (!file) {
            // Handle the case when there's no file
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            // Ensure that the event target is a FileReader and it has a result
            if (event.target instanceof FileReader && event.target.result) {
                const result = event.target.result as string;
                setImage(result);
            }
        };

        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*' as any,
    });

    const [showModal, setShowModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [showFailureModal, setShowFailureModal] = useState(false);

    const [rows, setRows] = useState<Array<{ trait_type: string; value: string }>>([]);

    const addRow = () => {
        setRows([...rows, { trait_type: '', value: '' }]);
    };

    const [createdNFT, setCreatedNFT] = useState<{
        tokenId: string;
    }>({
        tokenId: '',
    });

    const handleMint = async () => {
        try {
            setLoading(true);

            if (!contract) {
                throw new Error('Contract not initialized. Please make sure the contract is loaded.');
            }

            if (!walletAddress) {
                throw new Error('Wallet address not available. Please make sure the wallet is connected.');
            }

            if (!image) {
                throw new Error('Image upload failure. Please add an image.');
            }

            if (!name) {
                throw new Error('Name is required. Please enter a name.');
            }

            if (!description) {
                throw new Error('Description is required. Please enter a description.');
            }

            const metadata: Metadata = {
                name: name,
                description: description,
                image: image,
                attributes: [],
            };

            rows.forEach((row) => {
                metadata.attributes.push({
                    trait_type: row.trait_type,
                    value: row.value,
                });
            });

            const metadataString = JSON.stringify(metadata);
            const tx = await contract.erc721.mintTo(walletAddress, metadataString);
            console.log('Transaction Result:', tx);
            const { id: tokenId } = tx;

            const tokenIdAsString = tokenId?.toString() ?? '';

            if (!tx) {
                throw new Error('Minting process failed.');
            }

            setStatusMessage('NFT Created Successfully');
            setCreatedNFT({
                tokenId: tokenIdAsString,
            });
            setShowModal(true);
            setTimeout(() => {
                window.location.href = `/token/${NFT_COLLECTION_ADDRESS}/${tokenId}`;
            }, 5000);
        } catch (error) {
            console.error('MintTo işlemi sırasında bir hata oluştu:', error);
            console.log(error);
            setStatusMessage('Oops! Something went wrong!');
            setError((error as Error).message || 'An unknown error occurred.'); // Add type assertion here
            setShowFailureModal(true);
        } finally {
            setLoading(false);
            console.log(error);
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
            alert((error as Error).message || 'Upload failure. Please check the console for details.');
        }
    };

    // const handleCloseModal = () => {
    //     // Modal'ı kapat
    //     setShowModal(false);
    // };

    // const handleCloseFailureModal = () => {
    //     // Modal'ı kapat
    //     setShowFailureModal(false);
    // };

    // const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const file = e.dataTransfer.items[0];

    //     if (file && file.kind === 'file' && file.type.startsWith('image/')) {
    //         if (e.currentTarget instanceof HTMLDivElement) {
    //             e.currentTarget.classList.add(styles.dragover);
    //         }
    //     }
    // };

    // const handleDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (e.currentTarget instanceof HTMLDivElement) {
    //         e.currentTarget.classList.remove(styles.dragover);
    //     }

    //     const file = e.dataTransfer.files[0];

    //     if (file instanceof File) {
    //         try {
    //             const result = await readFileAsDataURL(file);
    //             setImage(result);
    //         } catch (error) {
    //             console.error('Error reading file:', error);
    //         }
    //     }
    // };

    // const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     if (e.currentTarget instanceof HTMLDivElement) {
    //         e.currentTarget.classList.remove(styles.dragover);
    //     }
    // };

    // const readFileAsDataURL = (file: File): Promise<string> => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();

    //         reader.onload = (event) => {
    //             if (event.target instanceof FileReader && event.target.result) {
    //                 resolve(event.target.result as string);
    //             } else {
    //                 reject(new Error('Failed to read file.'));
    //             }
    //         };

    //         reader.readAsDataURL(file);
    //     });
    // };

    // const isValidImageType = (file: File): boolean => {
    //     const allowedImageTypes = ['image/png', 'image/gif', 'image/webp', 'image/jpeg'];

    //     const fileType = file.type;

    //     const fileExtension = path.extname(file.name).toLowerCase();

    //     return allowedImageTypes.includes(fileType) || allowedImageTypes.includes(`image/${fileExtension}`);
    // };


    // const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //     try {
    //         const file = e.target.files && e.target.files[0];

    //         if (!file) {
    //             throw new Error('No file selected.');
    //         }

    //         if (!isValidImageType(file)) {
    //             throw new Error('Invalid file type. Please select a .png, .gif, .webp, .jpg, or .jpeg file.');
    //         }

    //     } catch (error) {
    //         console.error('Image upload failed:', error);
    //         alert((error as Error).message || 'Upload failure. Please check the console for details.');
    //     }
    // };

    return (
        <Container maxWidth="md">
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
                                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.input2} />
                                </label>
                            </div>
                        </div>
                        <div className={styles.containerRight}>
                            <div className={styles.rightColumn}>
                                <div className={styles.fileUpload}>
                                    {image ? <div className={`${styles.fileUploads} ${styles.selectedFile}`}>
                                        <Image src={image instanceof File ? URL.createObjectURL(image) : image} width={150} height={150} alt="Background gradient from red to blue" />
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
                                            <div
                                                className={styles.selectButton}
                                                {...getRootProps()}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}>
                                                <label htmlFor="fileInput">Select Image</label>
                                            </div>
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
                    {walletAddress ? (
                        <div className={styles.button}>
                            <button type="button" onClick={handleMint} disabled={loading} className={styles.btn}>
                                {loading ? 'Creating.....' : 'Create A NFT'}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.button}>
                            <p style={{ color: "red" }}>You should connect Web3 wallet !</p>
                        </div>
                    )}
                    {showModal && createdNFT && (
                        <Modal tokenId={createdNFT.tokenId} onClose={handleCloseModal} />
                    )}
                    {showFailureModal && (
                        <FailureModal onClose={handleCloseFailureModal} error={error} />
                    )}
                </form>
            </div>
        </Container>
    );
};

export default Mintable;
