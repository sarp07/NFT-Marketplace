import Link from "next/link";
import { useOwnedNFTs, useContract } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import artistAddresses from '../../const/artists.json'; // JSON dosyasını import et
import NFTGrid from "./NFTGrid2";

export default function NFTCollections({ nft }: { nft :any }) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);

    return (
        <>
            <div>
                {artistAddresses.map((address) => (
                    <li key={address} style={{ padding: "20px", fontSize: "25px", listStyle: "none" }}>
                        <Link href={`/profile/${address}`}>
                            {address.slice(0, 7)}............{address.slice(-5)} <br />
                            <p style={{ fontSize: "15px" }}>If you want to see more, please check the artist's <span style={{ color: "#0C6CF8" }}><Link href={`/profile/${address}`}>Profile.</Link></span></p>
                        </Link>
                        <ArtistNFTs artist={address} />
                    </li>
                ))}
            </div>
        </>
    );
}

function ArtistNFTs({ artist }: { artist : any }) {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS);
    const { data: ownedNFTs, isLoading: nftLoading } = useOwnedNFTs(contract, artist);

    return (
        <div>
            {nftLoading && <p>Loading...</p>}
            {ownedNFTs && (
                <div>
                    <br />
                    <h3>NFTs by Artist</h3>
                    <br />
                    <NFTGrid
                        data={ownedNFTs}
                        isLoading={nftLoading}
                        emptyText="This Artist has not created any NFTs yet."
                    />
                    <br />
                </div>
            )}
        </div>
    );
}
