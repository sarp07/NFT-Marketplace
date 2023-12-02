import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ProfilePicture.module.css';
import { useAddress } from '@thirdweb-dev/react';

const ProfilePicture = ({ userAddress }: { userAddress: any }) => {

  const walletAddress = useAddress()

  const [imageUrl, setImageUrl] = useState('https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg');
  const [showLabel, setShowLabel] = useState(true);


  const handleChange = async (event: any) => {
    const image = document.getElementById('output');
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);

      try {
        const response = await fetch('./upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setImageUrl(URL.createObjectURL(file));
        } else {
          console.error('Profile image upload failed:', data.message);
        }
      } catch (error: any) {
        console.log('Error object:', error);
        console.error('Error during profile image upload:', error.message);
      }
    }
  };

  useEffect(() => {
    if (walletAddress === userAddress) {
      setShowLabel(true);
    } else {
      setShowLabel(false);
    }
  }, [walletAddress, userAddress]);

  return (
    <div>
      {showLabel ? (
        <div className={styles.profilePic}>
          <label className={styles.label} htmlFor="file">
            <span className={styles.glyphiconCamera}></span>
            <span className={styles.span}>Change Image</span>
            <input id="file" type="file" onChange={handleChange} className={styles.input} />
          </label>
          <Image alt='profilePicture' src={imageUrl} id="output" width={150} height={150} className={styles.profileImage} />
        </div >
      ) : (
        <div className={styles.profilePic} >
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <Image alt='profilePicture' src={imageUrl} id="output" width={150} height={150} className={styles.profileImage} />
        </div >
      )}
    </div>
  );
};

export default ProfilePicture;
