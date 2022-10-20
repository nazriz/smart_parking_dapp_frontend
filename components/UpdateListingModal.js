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
            message: "Spot Availability Times Updated!",
            title: "Spot Availability Times Updated!",
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

    const { runContractFunction: setSpotTimes } = useWeb3Contract({
        abi: attributesAbi,
        contractAddress: "0x0A0Bbb42636AB8C3516882519ADD39DF56dCc5A5",
        functionName: "setSpotPermittedParkingTime",
        params: {
            _parking_spot_id: tokenId,
            _start_hour: startHour,
            _start_minute: startMinute,
            _end_hour: endHour,
            _end_minute: endMinute,
        },
    })
    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                setSpotTimes({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <div>
                <Input
                    label="Update Starting Hour"
                    name="update starting hour"
                    type="number"
                    onChange={(event) => {
                        setStartHour(event.target.value)
                    }}
                ></Input>
                <Input
                    label="Update Starting Minute"
                    name="update starting minute"
                    type="number"
                    onChange={(event) => {
                        setStartMinute(event.target.value)
                    }}
                ></Input>
                <Input
                    label="Update Ending Hour"
                    name="update ending hour"
                    type="number"
                    onChange={(event) => {
                        setEndHour(event.target.value)
                    }}
                ></Input>
                <Input
                    label="Update Ending Minute"
                    name="update ending minute"
                    type="number"
                    onChange={(event) => {
                        setEndMinute(event.target.value)
                    }}
                ></Input>
                <Input
                    label="Update Availability"
                    name="update availability"
                    type="boolean"
                    onChange={(event) => {
                        setAvailability(event.target.value)
                    }}
                ></Input>
            </div>
        </Modal>
    )
}
