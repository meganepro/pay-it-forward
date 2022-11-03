import NonFungibleToken from 0x01cf0e2f2f715450
import PayItForward from 0x01cf0e2f2f715450

// user(charlie)
transaction {
  let gifterCap: Capability<&AnyResource{PayItForward.Gifter}>
  let gifteeRef: &AnyResource{PayItForward.Giftee}
  let context: String
  prepare(user: AuthAccount) {
    //args
    let from: Address = 0x179b6b1cb6755e31
    let context = "for test"
    //##################################
    // context
    //##################################
    assert(context.length > 0, message: "Context length must be more than 0.")
    self.context = context
    //##################################
    // Gifter check
    //##################################
    self.gifterCap = getAccount(from).getCapability<&AnyResource{PayItForward.Gifter}>(PayItForward.CollectionPublicPath)
    //##################################
    // Giftee initialize
    //##################################
    // storage path
    if user.borrow<&PayItForward.Collection>(from: PayItForward.CollectionStoragePath) == nil {
      user.save(<- PayItForward.createEmptyCollection(), to: PayItForward.CollectionStoragePath)
    }
    // public path
    if user.getCapability(PayItForward.CollectionPublicPath).borrow<&{PayItForward.CollectionPublic, PayItForward.Gifter}>() == nil {
      //user.unlink(PayItForward.CollectionPublicPath)
      user.link<&{PayItForward.CollectionPublic, PayItForward.Gifter}>(
        PayItForward.CollectionPublicPath,
        target: PayItForward.CollectionStoragePath
      )
    }
    // private path
    if user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>() == nil {
      // private path
      user.link<&{PayItForward.Giftee}>(
        PayItForward.CollectionPrivatePath,
        target: PayItForward.CollectionStoragePath
      )
    }
    self.gifteeRef = user.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>()!
  }
  execute{
    self.gifteeRef.deposit(gifterCapability: self.gifterCap, context: self.context)
  }
}
 