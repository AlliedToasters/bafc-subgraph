import { BigInt } from "@graphprotocol/graph-ts"
import {
  vape,
  Approval,
  OperatorTransferred,
  OwnershipTransferred,
  TaxOfficeTransferred,
  Transfer
} from "../generated/vape/vape"
import { VapeHolder, VapeBurn } from "../generated/schema"

let nullAddress = "0x0000000000000000000000000000000000000000"
let burnV1Address = "0xa4dc0764d304ae0e4a694749cc40245427a08a1e"
let burnV2Address = "0x67b93e51633e6c19d6bd09f19a68e684f5a94dfb"
let burnV1StartBlock = new BigInt(14490012)
let burnV2StartBlock = new BigInt(14502650)

export function handleApproval(event: Approval): void {
  
}

export function handleOperatorTransferred(event: OperatorTransferred): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTaxOfficeTransferred(event: TaxOfficeTransferred): void {}

export function handleTransfer(event: Transfer): void {

  // let fromAccount = VapeHolder.load(event.params.from.toHex())
  // if (fromAccount == null) {
  //   fromAccount = new VapeHolder(event.params.from.toHex())
  // }

  // let toAccount = VapeHolder.load(event.params.to.toHex())
  // if (fromAccount == null) {
  //   toAccount = new VapeHolder(event.params.to.toHex())
  // }

  let isNullBurn = (event.params.to.toHex() == nullAddress)
  let isBurnV1 = ((event.params.to.toHex() == burnV1Address) && (event.block.number >= burnV1StartBlock) && (event.block.number <= burnV2StartBlock))
  let isBurnV2 = ((event.params.to.toHex() == burnV2Address) && (event.block.number > burnV2StartBlock))

  if (isNullBurn || isBurnV1 || isBurnV2) {
    let burn = new VapeBurn(event.transaction.hash.toHex() + '_' + event.params.to.toHex())
    let holder = VapeHolder.load(event.params.from.toHex())
    if (holder == null) {
      holder = new VapeHolder(event.params.from.toHex())
      holder.totalBurned = new BigInt(0)
    }
    burn.burner = event.params.from.toHex()
    burn.amount = event.params.value
    holder.totalBurned = holder.totalBurned.plus(event.params.value)
    burn.blockHeight = event.block.number
    burn.timestamp = event.block.timestamp
    burn.transactionId = event.transaction.hash.toHexString()
    burn.to = event.params.to.toHex()

    burn.save()
    holder.save()
  }



}
