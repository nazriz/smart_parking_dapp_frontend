import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/ NftMarketplace.json"
import attributesAbi from "../constants/ParkingSpotAttributes.json"
import { ethers } from "ethers"
import { NotificationProvider } from "web3uikit"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketPlaceAddress,
    onClose,
}) {
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)
    const [startHour, setStartHour] = useState(0)
    const [startMinute, setStartMinute] = useState(0)
    const [endHour, setEndHour] = useState(0)
    const [endMinute, setEndMinute] = useState(0)
    const [availability, setAvailability] = useState(null)
    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - pls refresh and move blocks",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    // const { runContractFunction: updateListing } = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketPlaceAddress,
    //     functionName: "updateListing",
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,
    //         newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    //     },
    // })

    const { runContractFunction: setSpotAvailability } = useWeb3Contract({
        abi: attributesAbi,
        contractAddress: "0x0A0Bbb42636AB8C3516882519ADD39DF56dCc5A5",
        functionName: "setSpotAvailability",
        params: { _parking_spot_id: tokenId, _availability: availability },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                setSpotAvailability({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
                // updateListing({
                //     onError: (error) => {
                //         console.log(error)
                //     },
                //     onSuccess: handleUpdateListingSuccess,
                // })
            }}
        >
            <div className="italic text-sm p-4">Please type true or false to set availability </div>
            <Input
                label="Update Availability"
                name="update availability"
                type="boolean"
                onChange={(event) => {
                    setAvailability(event.target.value)
                }}
            ></Input>
        </Modal>
    )
}
