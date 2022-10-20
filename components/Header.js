import { ConnectButton } from "@web3uikit/web3"
import Link from "next/Link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">Smart Parking dApp</h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Home</a>
                </Link>
                <Link href="/mint-parking-spot">
                    <a className="mr-4 p-6">Mint Parking Spot Token</a>
                </Link>
                <Link href="/manage-spot-availability">
                    <a className="mr-4 p-6">Toggle Availability</a>
                </Link>
                <Link href="/manage-funds">
                    <a className="mr-4 p-6">Manage Funds</a>
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
