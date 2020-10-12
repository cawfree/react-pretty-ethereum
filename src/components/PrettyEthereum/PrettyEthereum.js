import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useDeepCompareEffect from "use-deep-compare-effect";
import isEqual from "react-fast-compare";

import { usePrettyEthereumProvider } from "../PrettyEthereumProvider";

const defaultContext = Object.freeze({});

export const PrettyEthereumContext = React.createContext(defaultContext);

// TODO: required keys
function PrettyEthereum({ children, renderPlaceholder, ...txn }) {
  const { resolvers } = usePrettyEthereumProvider();
  // TODO: support a n-ary field object so it becomes extensible :)
  //       and just supply all of the callbacks
  // TODO: make this configurable
  const resolvePrettyEthereumEntry = useCallback(([k, value]) => {
    const resolver = resolvers[k];
    if (resolver !== undefined) {
      if (typeof resolver === "function") {
        return [k, resolver({ value })];
      }
      console.warn(
        `Detected an invalid resolver for key "${key}". This must be a function.`
      );
    }
    return null;
  }, [resolvers]);

  const shouldResolvePrettyEthereumEntries = useCallback((txn) => {
    return Object.fromEntries(
       Object.entries(txn)
         .map(resolvePrettyEthereumEntry)
         .filter(e => !!e),
     );
  }, [resolvePrettyEthereumEntry]);

  const [resolvedPrettyEthereum, setResolvedPrettyEthereum] = useState(() =>
    shouldResolvePrettyEthereumEntries(txn)
  );

  useDeepCompareEffect(() => {
    const next = shouldResolvePrettyEthereumEntries(txn);
    if (!isEqual(next, resolvedPrettyEthereum)) {
      setResolvedPrettyEthereum(next);
    }
  }, [
    txn,
    shouldResolvePrettyEthereumEntries,
    setResolvedPrettyEthereum,
    resolvedPrettyEthereum,
  ]);

  const shouldShowPlaceholder = !Object.keys(resolvedPrettyEthereum).length;
  return (
    <PrettyEthereumContext.Provider
      value={{
        ...defaultContext,
        ...resolvedPrettyEthereum,
      }}
    >
      {shouldShowPlaceholder ? renderPlaceholder(txn) : children}
    </PrettyEthereumContext.Provider>
  );
}

PrettyEthereum.propTypes = {
  renderPlaceholder: PropTypes.func,
};

PrettyEthereum.defaultProps = {
  ...defaultContext,
  renderPlaceholder: (txn) => <React.Fragment />,
};

export default PrettyEthereum;
