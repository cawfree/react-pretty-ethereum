import { useContext } from "react";

import { PrettyEthereumContext } from "./PrettyEthereumProvider";

export default function usePrettyEthereum() {
  return useContext(PrettyEthereumContext);
}
