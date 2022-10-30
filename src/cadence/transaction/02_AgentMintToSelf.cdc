import NonFungibleToken from 0x01cf0e2f2f715450
import PayItForward from 0x01cf0e2f2f715450

// admin(alice)
transaction {
  let gifteeCap: Capability<&AnyResource{PayItForward.Giftee}>
  let adminRef: &PayItForward.Administrator
  prepare(admin: AuthAccount) {
    pre{
      admin.borrow<&PayItForward.Administrator>(from: PayItForward.AdminStoragePath) != nil: "Admin must have Administrator Resource."
      admin.getCapability<&{PayItForward.Giftee}>(PayItForward.CollectionPrivatePath).borrow() != nil: "Admin must have Giftee Resource."
    }
    self.adminRef = admin.borrow<&PayItForward.Administrator>(from: PayItForward.AdminStoragePath)!
    self.gifteeCap = admin.getCapability<&{PayItForward.Giftee}>(PayItForward.CollectionPrivatePath)
  }
  execute{
    self.adminRef.adminDeposit(gifteeCapability: self.gifteeCap)
  }
}
 