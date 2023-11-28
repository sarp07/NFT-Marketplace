import Link from "next/link";
import { useOwnedNFTs, ThirdwebNftMedia, useContract, useRoleMembers } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import NFTGrid from "./NFTGrid2";

export default function NFTCollections({
    nft,
    isLoading,
    emptyText = "No NFTs found.",
}: Props) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: members, isLoading: membersLoading, error: membersError } = useRoleMembers(contract, "minter");

    return (
        <>
            <div>
                {isLoading && <p>Loading...</p>}
                {membersError && <p>Error: {membersError.message}</p>}

                {members && (
                    <div>
                        <ul>
                            {members.map((member) => (
                                <li key={member} style={{ padding: "20px", fontSize: "25px", listStyle: "none" }}>
                                    <Link href={`./profile/${member}`}>
                                        {member.slice(0, 7)}............{member.slice(-5)} <br />
                                        <p style={{fontSize: "15px"}}>If you want see more. Please check artist <span style={{color: "#0C6CF8"}}><Link href={`./profile/${member}`}>Profile.</Link></span></p>
                                    </Link>
                                    <ArtistNFTs artist={member} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
}

function ArtistNFTs({ artist }) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: ownedNFTs, isLoading: nftLoading, error: nftError } = useOwnedNFTs(contract, artist);
    const [nfts, setNfts] = useState([]);

    useEffect(() => {
        const fetchNfts = async () => {
            if (ownedNFTs) {
                const nftList = [];
                for (const nft of ownedNFTs) {
                    // Burada her bir NFT için istediğiniz bilgileri alabilir ve nftList'e ekleyebilirsiniz
                    // Örneğin: const nftInfo = await getNftInfo(nft); // getNftInfo fonksiyonunu projenize özgü olarak düzenleyin
                    nftList.push({ nft });
                }
                setNfts(nftList);
            }
        };

        fetchNfts();
    }, [ownedNFTs]);

    return (
        <div>
            {/* ... (loading ve hata durumları) */}
            {nftLoading && <p>Loading...</p>}
            {nftError && <p>Error: {nftError.message}</p>}

            {nfts.length > 0 && (
                <div>
                    <br />
                    <h3>NFTs by artist</h3>
                    <br />
                    {/* NFT bilgilerini burada görüntüle, örneğin:*/}
                    {/* <img src={nftItem.nft.imageUrl} alt={`NFT ${index}`} style={{ maxWidth: '100%', height: 'auto' }} />
                                <p>{nftItem.nft.name}</p>
                                <p>{nftItem.nft.description}</p> */}
                    <NFTGrid
                        data={ownedNFTs}
                        isLoading={nftLoading}
                        emptyText="Looks like you don't have any NFTs from this collection. Head to the buy page to buy some!"
                    />
                    <br />
                </div>
            )}
        </div>
    );

}
