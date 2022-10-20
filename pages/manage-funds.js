import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNft.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/ NftMarketplace.json"
import tokenAbi from "../constants/ParkingSpotToken.json"
import requestTokenAbi from "../constants/RequestParkingSpotToken.json"

export default function Home() {
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

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

    async function depositFunds(data) {
        const amount = ethers.utils.parseUnits(data.data[0].inputResult, "ether").toString()

        const depositOptions = {
            abi: requestTokenAbi,
            contractAddress: "0x86C07b993A3e26eB0e80AC96FeB54Ea44d4aF1C9",
            functionName: "deposit",
            msgValue: amount,
        }

        async function handleDepositSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Eth deposited!",
                title: "Eth deposited!",
                position: "topR",
            })
        }
        await runContractFunction({
            params: depositOptions,
            onSuccess: handleDepositSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function withdrawFunds(data) {
        const amount = ethers.utils.parseUnits(data.data[0].inputResult, "ether").toString()

        const withdrawOptions = {
            abi: requestTokenAbi,
            contractAddress: "0x86C07b993A3e26eB0e80AC96FeB54Ea44d4aF1C9",
            functionName: "withdraw",
            params: { _amount: amount },
        }

        async function handleWithdrawSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Eth withdrawn!",
                title: "Eth withdrawn!",
                position: "topR",
            })
        }
        await runContractFunction({
            params: withdrawOptions,
            onSuccess: handleWithdrawSuccess,
            onError: (error) => {
                console.log(error)
            },
        })
    }

    return (
        <div className={styles.container}>
            <div>
                <Form
                    onSubmit={depositFunds}
                    data={[
                        {
                            name: "Amount",
                            type: "number",
                            value: "",
                            key: "depositAmt",
                        },
                    ]}
                    title="Deposit:"
                    id="Main form"
                    customFooter={<Button type="submit" text="Deposit Ether" theme="primary" />}
                />
            </div>
            <div>
                <Form
                    onSubmit={withdrawFunds}
                    data={[
                        {
                            name: "Amount",
                            type: "number",
                            value: "",
                            key: "withdrawAmt",
                        },
                    ]}
                    title="Withdraw:"
                    id="Main form"
                    customFooter={<Button type="submit" text="Withdraw Ether" theme="primary" />}
                />
            </div>
        </div>
    )
}
