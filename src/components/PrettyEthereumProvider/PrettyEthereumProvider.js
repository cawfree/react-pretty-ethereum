import React from "react";
import PropTypes from "prop-types";
import deepmerge from "deepmerge";

const defaultContext = Object.freeze({
  resolvers: {
    from: ({ value }) => Promise.resolve(value),
  },
});

export const PrettyEthereumContext = React.createContext(defaultContext);

function PrettyEthereumProvider({
  children,
  resolvers,
}) {
  return (
    <PrettyEthereumContext.Provider value={deepmerge(defaultContext, { resolvers })}>
      {children}
    </PrettyEthereumContext.Provider>
  );
}

PrettyEthereumProvider.propTypes = {
  resolvers: PropTypes.shape({}),
};

PrettyEthereumProvider.defaultProps = {
  ...defaultContext,
};

export default PrettyEthereumProvider;
