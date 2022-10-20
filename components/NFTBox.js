import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/ NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import pstAbi from "../constants/ParkingSpotToken.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

const truncateString = (fullstr, strLen) => {
    if (fullstr.length <= strLen) return fullstr

    const seperator = "..."
    const seperatorLength = seperator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullstr.substring(0, frontChars) + seperator + fullstr.substring(fullstr.length - backChars)
    )
}

export default function NFTBox({ tokenId, spotOwner, startHour, endHour }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [parkingTokenOwner, setParkingTokenOwner] = useState("")
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: pstAbi,
        contractAddress: "0x7380e28aB1F6ED032671b085390194F07aBC2606",
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        // abi: nftMarketplaceAbi,
        // contractAddress: "0x7380e28aB1F6ED032671b085390194F07aBC2606",
        // functionName: "buyItem",
        // // msgValue: price,
        // params: {
        //     nftAddress: nftAddress,
        //     tokenId: tokenId,
        // },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()

        console.log("HERE IS TOKEN URI")
        console.log(tokenURI)
        console.log(tokenId)

        // if (tokenURI) {
        //     const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        //     const tokenURIResponse = await (await fetch(requestURL)).json()
        //     const imageURI = tokenURIResponse.image
        //     const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        setImageURI(tokenURI)
        // setTokenName(tokenURIResponse.name)
        // setTokenDescription(tokenURIResponse.description)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = spotOwner == account || spotOwner === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateString(spotOwner || "", 15)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: () => handleBuyItemSuccess(),
              })
    }

    // const handleBuyItemSuccess = () => {
    //     dispatch({
    //         type: "success",
    //         message: "Item bought!",
    //         title: "Item Bought",
    //         position: "topR",
    //     })
    // }

    console.log(parkingTokenOwner)

    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                // marketPlaceAddress={marketplaceAddress}
                                // nftAddress={nftAddress}
                                onClose={hideModal}
                            />
                            <Card
                                title={tokenId}
                                // description={tokenDescription}
                                onClick={handleCardClick}
                            >
                                <div className="p-2">
                                    <div className="flex flex-col items-end gap-2">
                                        <div>#{tokenId}</div>
                                        <div>Start Hour:{startHour}</div>
                                        <div>End Hour:{endHour}</div>

                                        <div className="italic text-sm">
                                            Owned by {formattedSellerAddress}
                                        </div>
                                        {/* <Image
                                            loader={() => imageURI}
                                            src={imageURI}
                                            height="200"
                                            width="200"
                                        /> */}
                                        <div className="font-bold">
                                            {ethers.utils.formatUnits(99, "ether")} ETH
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div> Loading...</div>
                )}
            </div>
        </div>
    )
}
