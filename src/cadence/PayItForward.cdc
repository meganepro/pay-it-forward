//import NonFungibleToken from 0x01cf0e2f2f715450 // for vscode extension
import NonFungibleToken from 0xf8d6e0586b0a20c7 // for emulator

pub contract PayItForward {

  pub var totalSupply: UInt64
  pub event PayItForwardEvent(received: UInt64, forwards: [UInt64], from: Address, to: Address, context: String)
  pub var isEnableMintAncestorNFT: Bool

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let CollectionPrivatePath: PrivatePath
  pub let AdminStoragePath: StoragePath

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub var numForMint: Int
    pub let originalNftId: UInt64
    pub let context: String 

    // もらうと増えるバイバインみたいなNFTなのでここにおく
    access(contract) fun mintNFTs(context: String): @[PayItForward.NFT] {
      pre{
        self.numForMint > 0: "Must have a number of times left to be mint."
      }
      post{
        before(self.numForMint) == result.length: "Minting counts do not match."
        before(PayItForward.totalSupply) + before(UInt64(self.numForMint)) == 
        PayItForward.totalSupply: "Minting counts do not match."
      }
      // 受け取った善行を元に次に繋げるNFTをmintする
      let mintedNFTs: @[PayItForward.NFT] <- []
      while self.numForMint > 0 {
        mintedNFTs.append(<- create NFT(PayItForward.totalSupply, (&self as auth &NFT), context))
        PayItForward.totalSupply = PayItForward.totalSupply + 1
        self.numForMint = self.numForMint - 1
      }

      return <- mintedNFTs
    }

    init(_ id: UInt64, _ originalNft: &NFT?, _ context: String) {
      pre{
        originalNft != nil || PayItForward.isEnableMintAncestorNFT:"Must have valid nft, if not to create ancestor nft."
      }
      self.id = id
      if(originalNft == nil){
        self.originalNftId = 0
        self.numForMint = 10
      }else{
        self.originalNftId = originalNft!.id
        self.numForMint = 3
      }
      self.context = context
    }
  }

  // 渡し手（イイことした側）
  pub resource interface Gifter {
    pub fun withdraw(): @NFT
  }

  // 貰い手（イイコトされた側）
  pub resource interface Giftee {
    pub var toPay: @[NFT]
    pub fun addToPay(nft: @NFT)
    pub fun addReceived(nft: @NFT)
    pub fun deposit(gifterCapability: Capability<&AnyResource{PayItForward.CollectionPublic}>, context: String){
      post{
        before(self.toPay.length) + 3 ==  self.toPay.length: "Must add 3 toPay NFT"
      }
    }
  }
  

  // Interface that an account would commonly 
  // publish for their collection
  pub resource interface CollectionPublic {
    pub fun withdraw(): @NFT
    pub fun getReceivedOriginalIds(): [UInt64]
    pub fun borrowReceiveds(originalId: UInt64): &PayItForward.NFT
    pub fun borrowToPays(): &[&PayItForward.NFT]
  }

  pub resource Collection: Gifter, Giftee, CollectionPublic
  {
    pub var received: @{UInt64: NFT}
    pub var toPay: @[NFT]

    // FIFO
    pub fun withdraw(): @NFT {
      return <- self.toPay.removeFirst()!
    }

    pub fun addToPay(nft: @NFT) {
      self.toPay.append(<-nft)
    }

    pub fun addReceived(nft: @NFT) {
      let buff <- self.received[nft.originalNftId] <- nft
      destroy buff
    }

    // 人から受け取ってmintする
    pub fun deposit(gifterCapability: Capability<&AnyResource{PayItForward.CollectionPublic}>, context: String){
      pre {
          gifterCapability.borrow() != nil: "Could not borrow gifter capability."
          self.owner!.address != gifterCapability.address : "Could not mint same user."
      }
      // received
      let token <- gifterCapability.borrow()!.withdraw()
      assert(!self.received.containsKey(token.originalNftId), message: "That good deed was already received.")

      // mint to pay it forward
      let mintedNFTs <- token.mintNFTs(context: context)
      var count = mintedNFTs.length
      var mintedNftIDs: [UInt64] = []
      while count > 0 {
        let nft <- mintedNFTs.removeFirst()
        mintedNftIDs.append(nft.id)
        self.toPay.append(<- nft)
        count = count -1
      }
      destroy mintedNFTs

      // event Emit
      emit PayItForwardEvent(
        received: token.id,
        forwards: mintedNftIDs,
        from: gifterCapability.address,
        to: self.owner!.address,
        context: context)

      // saved original
      self.received[token.originalNftId] <-! token
    }

    // getReceivedOriginalIds returns an array of the IDs that are in the collection
    pub fun getReceivedOriginalIds(): [UInt64] {
      return self.received.keys
    }

    pub fun borrowReceiveds(originalId: UInt64): &PayItForward.NFT {
      return (&self.received[originalId] as &PayItForward.NFT?)!
    }

    pub fun borrowToPays(): &[&PayItForward.NFT] {
      let toPaysRef: [&PayItForward.NFT] = []
      let count = self.toPay.length
      var index = 0
      while count > index {
        toPaysRef.append(&self.toPay[index] as &PayItForward.NFT)
        index = index + 1
      }
      return (&toPaysRef as &[&PayItForward.NFT])
    }

    init() {
      self.received <- {}
      self.toPay <- []
    }

    destroy() {
      destroy self.received
      destroy self.toPay
    }
  }

  // createEmptyCollection creates an empty Collection
  // and returns it to the caller so that they can own NFTs
  pub fun createEmptyCollection(): @Collection {
    post {
      result.getReceivedOriginalIds().length == 0: "The created collection must be empty!"
    }
    return <- create Collection()
  }

  //*************************************************************
  // Administrator
  //*************************************************************
  pub resource Administrator {

    /// 指定した人に対して配る
    pub fun adminDeposit(gifteeCapability: Capability<&AnyResource{PayItForward.Giftee}>){
      pre {
          gifteeCapability.borrow() != nil: "Could not borrow gifter capability."
      }
      let gifteeRef = gifteeCapability.borrow()!

      // mint ancestor token
      PayItForward.isEnableMintAncestorNFT = true
      let token <- create NFT(PayItForward.totalSupply, nil, "mint initial nft")
      PayItForward.totalSupply = PayItForward.totalSupply + 1

      // mint to pay it forward
      let context = "ancestor nft"
      let mintedNFTs <- token.mintNFTs(context: context)
      var count = mintedNFTs.length
      var mintedNftIDs: [UInt64] = []
      while count > 0 {
        let nft <- mintedNFTs.removeFirst()
        mintedNftIDs.append(nft.id)
        gifteeRef.addToPay(nft: <-nft)
        count = count -1
      }
      destroy mintedNFTs

      // event Emit
      emit PayItForwardEvent(
        received: token.id,
        forwards: mintedNftIDs,
        from: gifteeCapability.address,
        to: self.owner!.address,
        context: context)

      // saved original
      gifteeRef.addReceived(nft: <- token)
    }
  }
  
  init() {
    self.totalSupply = 0
    self.CollectionStoragePath = /storage/PayItForwardCollection
    self.CollectionPublicPath = /public/PayItForwardCollection
    self.CollectionPrivatePath = /private/PayItForwardCollection
    self.AdminStoragePath = /storage/PayItForwardAdmin
    self.isEnableMintAncestorNFT = false

    // let collection <- PayItForward.createEmptyCollection()
    // self.account.save(<-collection, to: self.CollectionStoragePath)
    // let collectionRef = self.account.borrow<&PayItForward.Collection>(from: self.CollectionStoragePath)
    // collectionRef!.createAncestorInitialNFT()

    // admin
    let admin <- create Administrator()
    self.account.save(<-admin, to: self.AdminStoragePath)
  }
}
 