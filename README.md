# react-pretty-ethereum
Tools to render Web3 data models in a user-friendly way, because [**Ethereum**](https://ethereum.org) is complicated enough for outsiders.

The project works in two simple ways:
  - Firstly, you register mechanisms by which low-level information can be converted into something more useful to an end user.
    - For instance, you could override an ethereum address to resolve to a user's profile name, if it was known.
  - Secondly, you declare dedicated [**render props**](https://reactjs.org/docs/render-props.html) capable of handling the processed data.

Supports both [**React**](https://reactjs.org) and [**React Native**](https://reactnative.dev).

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com):

```bash
yarn add react-pretty-ethereum
```

## ✍️ Usage

Use the [`<PrettyEthereumProvider`](./src/components/PrettyEthereumProvider/PrettyEthereumProvider.js) to declare ways to process data.

There are two _resolver_ methods used:
  - We provide a way to convert Ethereum wallet addresses into user names.
  - Next, there's a simple demonstration of how we could convert transaction values into high-level components.

We create dedicated components to handle these types of resolved transaction keys using the [`createPrettyEthereum`](./src/components/PrettyEthereum/createPrettyEthereum.js) function, which creates a [**Component**](https://reactjs.org/docs/react-component.html) which receives transformed values and renders them via a child render prop.

```javascript
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";

import React, { useCallback } from "react";
import { IntlProvider, FormattedNumber } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

import PrettyEthereumProvider, { PrettyEthereum, createPrettyEthereum } from "react-pretty-ethereum";

/* example high-level data */
const Bob = "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3";
const Alice = "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359"; 

/* example fields */
const From = createPrettyEthereum("from");
const To = createPrettyEthereum("to");
const Value = createPrettyEthereum("value");

const styles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: { fontFamily: 'Arial', fontSize: 14 },
});

export default function App() {
  const renderUser = useCallback(({ value: children, style }) => (
    <Text style={style} children={children} />
  ), []);

  const renderCurrency = useCallback(({ value, currencyFormat, style }) => (
    <Text style={[styles.text, styles.bold, StyleSheet.flatten(style)]}>
      <FormattedNumber
        value={value[currencyFormat]}
        currency={currencyFormat}
        style="currency"
      />
    </Text>
  ), []);

  /* https://docs.sendwyre.com/docs/live-exchange-rates 10/12/20 */
  const conversionRates = {
    ETHGBP: 0.0035,
    ETHUSD: 0.0027,
  };

  // TODO: test we can replace this
  const resolveAddress = useCallback(({ value }) => {
    if (value === Bob) {
      return "Bob";
    } else if (value === Alice) {
      return "Alice";
    }
    return value;
  }, []);

  const resolveCurrency = useCallback(({ value }) => {
    const { ETHGBP, ETHUSD } = conversionRates;
    const valueInWei = BigNumber(value);
    const valueInEth = BigNumber(valueInWei).dividedBy(ethers.constants.WeiPerEther.toString());
    const USD = valueInEth.dividedBy(BigNumber(ETHUSD));
    const GBP = valueInEth.dividedBy(BigNumber(ETHGBP));
    return { GBP, USD };
  }, [conversionRates]);

  return (
    <IntlProvider locale="en">
      <PrettyEthereumProvider
        resolvers={{
          from: resolveAddress,
          to: resolveAddress,
          gas: resolveCurrency,
          value: resolveCurrency,
        }}
      >
        <View style={styles.center}>
          <PrettyEthereum
            {...{
              from: Bob,
              to: Alice,
              value: ethers.constants.WeiPerEther.toString(),
            }}
          >
            <Text style={styles.text}>
              {"🔥 "}
              <From style={styles.bold} children={renderUser} />
              <Text style={styles.text} children=" would like to send " />
              <Value currencyFormat="GBP" children={renderCurrency} />
              <Text style={styles.text} children=" to " />
              <To style={styles.bold} children={renderUser} />
              <Text style={styles.text} children="!" />
              {" 🔥"}
            </Text>
          </PrettyEthereum>
        </View>
      </PrettyEthereumProvider>
    </IntlProvider>
  );
}
```

This yields the following result:

<p align="center">
  <img src="./public/alice.png" alt="react-pretty-web3"></img>
</p>

## ✌️ License
[**MIT**](./LICENSE)
