import NonFungibleToken from 0x01cf0e2f2f715450
import PayItForward from 0x01cf0e2f2f715450

// agent(alice)
transaction {
  prepare(agent: AuthAccount) {
    //##################################
    // PayItForward.Collection
    //##################################
    // storage path
    if agent.borrow<&PayItForward.Collection>(from: PayItForward.CollectionStoragePath) == nil {
      agent.save(<- PayItForward.createEmptyCollection(), to: PayItForward.CollectionStoragePath)
    }
    // public path
    if agent.getCapability(PayItForward.CollectionPublicPath).borrow<&{PayItForward.CollectionPublic, PayItForward.Gifter}>() == nil {
      //agent.unlink(PayItForward.CollectionPublicPath)
      agent.link<&{PayItForward.CollectionPublic, PayItForward.Gifter}>(
        PayItForward.CollectionPublicPath,
        target: PayItForward.CollectionStoragePath
      )
    }
    // private path
    if agent.getCapability(PayItForward.CollectionPrivatePath).borrow<&{PayItForward.Giftee}>() == nil {
      // private path
      agent.link<&{PayItForward.Giftee}>(
        PayItForward.CollectionPrivatePath,
        target: PayItForward.CollectionStoragePath
      )
    }
  }
}
 