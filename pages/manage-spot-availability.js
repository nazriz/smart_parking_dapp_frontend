import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import { useQuery } from "@apollo/client"
import {
    GET_AVAILABLE_SPOTS,
    PARKING_SPOT_MINTED,
    PARKING_SPOT_PERMITTED_TIMES,
    MINTED_BY_ADDRESS,
} from "../constants/subgraphQueries"
import NFTBoxAvailability from "../components/NFTBoxAvailability"

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketPlaceAddress = networkMapping[chainString].NftMarketplace[0]

    // Retrieve the tokenID's of currently available spots
    const { data: available_spots } = useQuery(GET_AVAILABLE_SPOTS)
    let availableSpotsList = []
    available_spots?.parkingSpotAvailables.map((spots) => {
        let { tokenId } = spots
        availableSpotsList.push(tokenId)
    })

    const { loading, data: minted_by_address } = useQuery(MINTED_BY_ADDRESS, {
        variables: { input: { owner: account } },
    })

    const { data: minted_spots } = useQuery(PARKING_SPOT_MINTED)

    const spotOwners = {}

    minted_spots?.parkingSpotMinteds.map((mintedSpots) => {
        const { owner, tokenId } = mintedSpots
        spotOwners[tokenId] = owner
    })
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Parking Tokens Owned by You:</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !minted_by_address ? (
                        <div>Loading...</div>
                    ) : (
                        minted_by_address?.parkingSpotMinteds.map((spots) => {
                            const { tokenId } = spots

                            // console.log(`NFT TOKEN ID: ${tokenId}`)
                            return (
                                <div>
                                    <NFTBoxAvailability
                                        tokenId={tokenId}
                                        spotOwner={spotOwners[tokenId]}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div> Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
