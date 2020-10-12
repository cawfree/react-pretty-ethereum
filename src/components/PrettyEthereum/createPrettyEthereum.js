import React from "react";
import PropTypes from "prop-types";

import { usePrettyEthereum } from ".";

export default function createPrettyEthereum(fieldName) {
  if (typeof fieldName !== "string" || !fieldName.length) {
    throw new Error(`Expected non-empty string fieldName, encountered ${fieldName}.`);
  }

  const displayName = 
    `${fieldName.substring(0, 1).toUpperCase()}${fieldName.substring(1)}`;

  function PrettyEthereumField({ children, value: shouldThrowIfDefined, ...extras }) {
    const { [fieldName]: value } = usePrettyEthereum();
    if (shouldThrowIfDefined !== undefined) {
      throw new Error(
        `<${displayName}/> attempted to define a value prop, but this is illegal.`
      );
    }
    if (!value) {
      return null;
    }
    return children({ ...extras, value });
  }

  PrettyEthereumField.propTypes = {
    children: PropTypes.func,
  };

  PrettyEthereumField.defaultProps = {
    children: ({}) => null,
  };

  PrettyEthereumField.displayName = displayName;

  return PrettyEthereumField;
}
