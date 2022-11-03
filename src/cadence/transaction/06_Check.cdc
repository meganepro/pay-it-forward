import NonFungibleToken from 0x01cf0e2f2f715450
import PayItForward from 0x01cf0e2f2f715450

pub fun main(): {String: AnyStruct} {

    // Bob: 0x179b6b1cb6755e31, Charlie: 0xf3fcd2c1a78f5eee
    let addresses: {String: Address} = {
      "alice": 0x01cf0e2f2f715450,
      "bob": 0x179b6b1cb6755e31,
      "charlie": 0xf3fcd2c1a78f5eee
    }

    let res: {String: AnyStruct} = {}
    for name in addresses.keys {
      // collection -> item & nft
      let collectionRef = getAccount(addresses[name]!).getCapability(PayItForward.CollectionPublicPath)
      .borrow<&AnyResource{PayItForward.CollectionPublic, PayItForward.Gifter}>()
      if(collectionRef == nil){
        continue
      }
      // toPay
      let toPays = collectionRef!.borrowToPays()
      let toPayNfts: [AnyStruct] = []
      var count = toPays.length
      while count > 0 {
        let nft = toPays.removeFirst()
        toPayNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": ""
        })
        count = count - 1
      }

      // received
      let receivedIds = collectionRef!.getReceivedOriginalIds()
      let receivedNfts: [AnyStruct] = []
      for receivedId in receivedIds {
        let nft = collectionRef!.borrowReceiveds(originalId: receivedId)
        receivedNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": nft.owner!.address
        })
      }

      // proof
      let proofs: {UInt64: PayItForward.ProofData} = collectionRef!.proof
      let proofNfts: [AnyStruct] = []
      for proofId in proofs.keys {
        let proofData = proofs[proofId]!
        let collectionRef = getAccount(proofData.address).getCapability(PayItForward.CollectionPublicPath)
      .borrow<&AnyResource{PayItForward.CollectionPublic}>()!
        let nft = collectionRef!.borrowReceiveds(originalId: proofData.originalNftId)
        proofNfts.append({
          "id": nft.id,
          "originalNftId": nft.originalNftId,
          "context": nft.context,
          "createdAt": nft.timestamp,
          "gifter": nft.from,
          "giftee": nft.owner!.address
        })
      }
      // syu-kei
      res[name] = {
        "received": receivedNfts,
        "toPay": toPayNfts,
        "proof": proofNfts
      }
    }
    res["total"] = {"totalSupply": PayItForward.totalSupply}
    return res
}
 