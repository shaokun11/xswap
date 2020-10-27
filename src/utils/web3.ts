import { providers } from "ethers";

export function getLibrary(provider: any) {
  const lib = new providers.Web3Provider(provider);
  lib.pollingInterval = 15000;
  return lib;
}
