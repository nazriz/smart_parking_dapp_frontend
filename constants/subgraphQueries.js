import { gql } from "@apollo/client"

const GET_AVAILABLE_SPOTS = gql`
    {
        parkingSpotAvailables(first: 5) {
            tokenId
            available
        }
    }
`
const PARKING_SPOT_PERMITTED_TIMES = gql`
    {
        parkingSpotPermittedTimes(tokenId: [int]) {
            tokenId
            startHour
            startMinute
            endHour
            endMinute
        }
    }
`

const PARKING_SPOT_MINTED = gql`
    {
        parkingSpotMinteds(first: 20) {
            tokenId
            owner
        }
    }
`
const MINTED_BY_ADDRESS = gql`
    {
        parkingSpotMinteds(where: { owner: string }) {
            tokenId
            owner
        }
    }
`

export { GET_AVAILABLE_SPOTS, PARKING_SPOT_PERMITTED_TIMES, PARKING_SPOT_MINTED, MINTED_BY_ADDRESS }

// const GET_ACTIVE_ITEMS = gql`
//     {
//         activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
//             id
//             buyer
//             seller
//             nftAddress
//             tokenId
//             price
//         }
//     }
// `
