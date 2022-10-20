import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/ NftMarketplace.json"
import networkMapping from "../constants/networkMapping.json"
import offchainResponseAbi from "../constants/OffchainParkingDataResponse.json"
import tokenAbi from "../constants/ParkingSpotToken.json"

export default function Home() {
    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })

        async function handleApproveSuccess(nftAddress, tokenId, price) {
            console.log("Ok, now time to list!")

            const listOptions = {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "listItem",
                params: {
                    nftAddress: nftAddress,
                    tokenId: tokenId,
                    price: price,
                },
            }
            await runContractFunction({
                params: listOptions,
                onSuccess: () => handleListSuccess(),
                onError: (error) => console.log(error),
            })

            async function handleListSuccess() {
                dispatch({
                    type: "success",
                    message: "NFT listing",
                    title: "NFT listed",
                    position: "topR",
                })
            }
        }
    }

    const handleRequestBytesSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Parking Spot Data Brought Onchain!",
            title: "Data onchain!",
            position: "topR",
        })
    }

    async function mintParkingToken(data) {
        const walletAddress = data.data[0].inputResult
        const spotIndex = data.data[1].inputResult

        const mintOptions = {
            abi: tokenAbi,
            contractAddress: "0x7380e28aB1F6ED032671b085390194F07aBC2606",
            functionName: "mintParkingSpot",
            params: {
                _user: walletAddress,
                _index: spotIndex,
            },
        }

        async function handleMintSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Parking Spot Minted!",
                title: "Spot Minted!",
                position: "topR",
            })
        }
        await runContractFunction({
            params: mintOptions,
            onSuccess: () => handleMintSuccess(),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    const { runContractFunction: requestFakeBytes } = useWeb3Contract({
        abi: offchainResponseAbi,
        contractAddress: "0x5ecA6776c44E49753CB2910e2BFB0Ca2D756F62b",
        functionName: "fakeFulfillBytes",
    })

    return (
        <div className={styles.container}>
            <div>
                <Button
                    color="red"
                    onClick={function noRefCheck() {
                        requestFakeBytes({
                            onError: (error) => {
                                console.log(error)
                            },
                            onSuccess: handleRequestBytesSuccess,
                        })
                    }}
                    text="1. Bring Parking Spot Data Onchain"
                    theme="colored"
                />
            </div>
            <Form
                onSubmit={mintParkingToken}
                data={[
                    {
                        name: "Destination Wallet Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "walletAddress",
                    },
                    {
                        name: "Parking Spot Index",
                        type: "number",
                        value: "",
                        key: "spotIndex",
                    },
                ]}
                title="Mint Parking Spot Token:"
                id="Main form"
                customFooter={<Button type="submit" text="2. Mint Parking Token" theme="primary" />}
            />
        </div>
    )
}
