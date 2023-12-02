import Link from "next/link";
import { useOwnedNFTs, useContract, useRoleMembers } from "@thirdweb-dev/react";
import {  useState } from "react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import NFTGrid from "./NFTGrid2";

export default function NFTCollections({ nft }: { nft :any }) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: members, isLoading: membersLoading, error: membersError } = useRoleMembers(contract, "minter");

    return (
        <>
            <div>
                {membersLoading && <p>Loading...</p>}
                {members && (
                    <div>
                        <ul>
                            {members.map((member) => (
                                <li key={member} style={{ padding: "20px", fontSize: "25px", listStyle: "none" }}>
                                    <Link href={`./profile/${member}`}>
                                        {member.slice(0, 7)}............{member.slice(-5)} <br />
                                        <p style={{ fontSize: "15px" }}>If you want see more. Please check artist <span style={{ color: "#0C6CF8" }}><Link href={`./profile/${member}`}>Profile.</Link></span></p>
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

function ArtistNFTs({ artist }: { artist : any }) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: ownedNFTs, isLoading: nftLoading, error: nftError } = useOwnedNFTs(contract, artist);
    const [nfts, setNfts] = useState([]);

    return (
        <div>
            {/* ... (loading ve hata durumları) */}
            {nftLoading && <p>Loading...</p>}
            {ownedNFTs && (
                <div>
                    <br />
                    <h3>NFTs by artist</h3>
                    <br />
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
