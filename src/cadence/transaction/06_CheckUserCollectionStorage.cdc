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
      .borrow<&AnyResource{PayItForward.CollectionPublic}>()
      if(collectionRef == nil){
        continue
      }
      // toPay
      let toPays = collectionRef!.borrowToPays()
      let nfts: {UInt64: AnyStruct} = {}
      var count = toPays.length
      while count > 0 {
        let nft = toPays.removeFirst()
        nfts[nft.id] = {"oriId": nft.originalNftId, "context": nft.context}
        count = count - 1
      }

      // received
      let receiveds: {UInt64: AnyStruct} = {}
      let receivedIds = collectionRef!.getReceivedOriginalIds()
      for receivedId in receivedIds {
        let nftRef = collectionRef!.borrowReceiveds(originalId: receivedId)
        receiveds[nftRef.id] = nftRef.originalNftId
      }



      // syu-kei
      res[name] = {
        "received": receiveds,
        "toPays": nfts
      }
    }
    res["total"] = {"totalSupply": PayItForward.totalSupply}
    return res
}
 