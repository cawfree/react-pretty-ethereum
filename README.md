# react-pretty-web3
Render Web3 data models in a user-friendly way. (React/React Native)

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
