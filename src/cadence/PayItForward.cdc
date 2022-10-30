import NonFungibleToken from 0x01cf0e2f2f715450

pub contract PayItForward {

  pub var totalSupply: UInt64
  pub event PayItForwardEvent(received: UInt64, forwards: [UInt64], from: Address, to: Address, context: String)

  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub var numForMint: Int
    pub let originalNftId: UInt64

    // もらうと増えるバイバインみたいなNFTなのでここにおく
    access(contract) fun mintNFTs(): @[PayItForward.NFT] {
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
        mintedNFTs.append(<- create NFT(PayItForward.totalSupply, (&self as auth &NFT), nil))
        PayItForward.totalSupply = PayItForward.totalSupply + 1
        self.numForMint = self.numForMint - 1
      }

      return <- mintedNFTs
    }

    init(_ id: UInt64, _ originalNft: &NFT?, _ num: Int?) {
      self.id = id
      if(PayItForward.totalSupply > 0){
        self.numForMint = 3
        self.originalNftId = originalNft!.id
      }else{
        // 初回処理
        self.numForMint = num!
        self.originalNftId = 0
        PayItForward.totalSupply = PayItForward.totalSupply + 1
      }
    }
  }

  // 渡し手（イイことした側）
  pub resource interface Gifter {
    pub fun withdraw(): @NFT
  }

  // 貰い手（イイコトされた側）
  pub resource interface Giftee {
    pub var toPay: @[NFT]
    pub fun deposit(gifterCapability: Capability<&AnyResource{PayItForward.Gifter}>){
      post{
        before(self.toPay.length) + 3 ==  self.toPay.length: "Must add 3 toPay NFT"
      }
    }
  }
  

  // Interface that an account would commonly 
  // publish for their collection
  pub resource interface CollectionPublic {
    pub fun getReceivedIds(): [UInt64]
    pub fun borrowReceiveds(id: UInt64): &PayItForward.NFT
    pub fun borrowToPays(): &[PayItForward.NFT]
  }

  pub resource Collection: Gifter, Giftee, CollectionPublic
  {
    pub var received: @{UInt64: NFT}
    pub var toPay: @[NFT]

    // FIFO
    pub fun withdraw(): @NFT {
      return <- self.toPay.removeFirst()!
    }

    pub fun deposit(gifterCapability: Capability<&AnyResource{PayItForward.Gifter}>){
      pre {
          gifterCapability.borrow() != nil: "Could not borrow gifter capability."
          self.owner!.address != gifterCapability.address : "Could not mint same user."
      }
      // received
      let token <- gifterCapability.borrow()!.withdraw()
      assert(!self.received.containsKey(token.id), message: "That good deed was already received.")

      // mint to pay it forward
      let mintedNFTs <- token.mintNFTs()
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
        context: "")

      // saved original
      self.received[token.id] <-! token
    }

    access(account) fun depositAncestorInitialNFT(){
      self.toPay.append(<- create NFT(0, nil, 100))
    }

    // getReceivedIds returns an array of the IDs that are in the collection
    pub fun getReceivedIds(): [UInt64] {
      return self.received.keys
    }

    pub fun borrowReceiveds(id: UInt64): &PayItForward.NFT {
      return (&self.received[id] as &PayItForward.NFT?)!
    }

    pub fun borrowToPays(): &[PayItForward.NFT] {
      return (&self.toPay as &[PayItForward.NFT])
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
      result.getReceivedIds().length == 0: "The created collection must be empty!"
    }
    return <- create Collection()
  }
  
  init() {
    self.totalSupply = 0
    self.CollectionStoragePath = /storage/PayItForward
    self.CollectionPublicPath = /public/PayItForward

    let collection <- self.createEmptyCollection()
    self.account.save(<-collection, to: self.CollectionStoragePath)
    let collectionRef = self.account.borrow<&PayItForward.Collection>(from: self.CollectionStoragePath)
    collectionRef!.depositAncestorInitialNFT()
  }
}