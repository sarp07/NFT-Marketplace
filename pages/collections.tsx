import { useContract, useNFTs } from "@thirdweb-dev/react";
import React from "react";
import Container from "../components/Container/Container";
import NFTCollections from "../components/NFT/NFTCollections";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";

export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const { contract } = useContract(NFT_COLLECTION_ADDRESS);
  const { data, isLoading, error: nftError } = useNFTs(contract);

  return (
    <Container maxWidth="lg">
      <h1>List All Collections and Artist</h1>
      <p>Browse which NFTs are available from the all collections by ownerships.</p>
      <br />
      <br />
      <br />
      <NFTCollections
        data={data}
        isLoading={isLoading}
        emptyText={
          "Looks like there are no NFTs in this collection. Did you import your contract on the thirdweb dashboard? https://thirdweb.com/dashboard"
        }
      />
    </Container>
  );
}
