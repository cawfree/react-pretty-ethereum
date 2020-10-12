import { useContext } from "react";

import { PrettyEthereumContext } from "./PrettyEthereum";

export default function usePrettyEthereum() {
  return useContext(PrettyEthereumContext);
}
