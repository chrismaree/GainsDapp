import Web3 from "web3";
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import moment from "moment";

import {
  getEtherscanAddress,
  getNetIdString,
}
from "@/utils/lookupTools";

import getTokenInfo from "@/utils/TokenInfo.js"

import * as actions from "./actions";
import * as mutations from "./mutation-types";

// import truffleContract from "truffle-contract";

// import FundFactoryABI from "../../build/contracts/FundFactory.json"
// import FundABI from "../../build/contracts/Fund.json"

// const FundFactory = truffleContract(FundFactoryABI);
// const Fund = truffleContract(FundABI);
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    web3: null,
    account: null,
    currentNetwork: null,
    etherscanBase: null,
    TokenInfo: null,
    setUserFunds: [],
    usdPrice: 300
  },
  mutations: {
    //WEB3 Stuff
    [mutations.SET_ACCOUNT](state, account) {
      state.account = account;
    },
    [mutations.SET_CURRENT_NETWORK](state, currentNetwork) {
      state.currentNetwork = currentNetwork;
    },
    [mutations.SET_ETHERSCAN_NETWORK](state, etherscanBase) {
      state.etherscanBase = etherscanBase;
    },
    [mutations.SET_WEB3]: async function (state, web3) {
      state.web3 = web3;
    },
    [mutations.SET_USD_PRICE](state, price) {
      state.usdPrice = price;
    },
  },
  actions: {
    [actions.GET_CURRENT_NETWORK]: function ({
      commit,
      dispatch,
      state
    }) {
      getNetIdString().then(currentNetwork => {
        commit(mutations.SET_CURRENT_NETWORK, currentNetwork);
      });
      getEtherscanAddress().then(etherscanBase => {
        commit(mutations.SET_ETHERSCAN_NETWORK, etherscanBase);
      });
    },

    [actions.INIT_APP]: async function ({
      commit,
      dispatch,
      state
    }, web3) {
      // FundFactory.setProvider(web3.currentProvider)
      // Fund.setProvider(web3.currentProvider)
      // Set the web3 instance
      console.log("IN STORE")
      console.log(web3)
      // commit(mutations.SET_WEB3, {
      //   web3
      // });
      console.log("set")

      dispatch(actions.GET_CURRENT_NETWORK);

      let accounts = await web3.eth.getAccounts();
      let account = accounts[0];
      if (account) {
        commit(mutations.SET_ACCOUNT, account);
      }
      // let fundFactory = await FundFactory.at(state.factoryAddress)
      // console.log("logging vyper from UI")
      // let numberOfFunds = await fundFactory.getAllFundUids()
      // state.numberOfFunds = numberOfFunds.toString(10)
      // console.log(numberOfFunds.toString())
      // commit(mutations.SET_NUMBER_OF_FUNDS, numberOfFunds.toString());

      // let userFunds = await fundFactory.getFundForOwner.call(state.account)
      // console.log("USER FUNDS")
      // console.log(userFunds)

      // let userFundsProcessed = []
      // userFunds.forEach(async function (fund) {
      //   let fundDetails = await fundFactory.getFundDetails.call(fund.toString())
      //   console.log("VALUE")
      //   console.log(fundDetails[1].toString())
      //   // userFundsProcessed.push(fundDetails.toString())
      //   let fundContract = await Fund.at(fundDetails[1].toString())
      //   let fundComponents = await fundContract.getTokens.call()
      //   console.log("TOKENS")
      //   console.log(fundComponents)
      //   let fundComponentsProcessed = []
      //   let count = 0

      //   for (let i = 0; i < 100; i++) {
      //     if (fundComponents[0][i] = '0x0000000000000000000000000000000000000000' && i !=0) {
      //       break
      //     }
      //     fundComponentsProcessed.push({
      //       token: fundComponents[0][i],
      //       weighting: fundComponents[1][i]
      //     })
      //   }

      //   console.log("COMMMPPP")
      //   console.log(fundComponentsProcessed)

      // })
      // console.log("USER FUNDS P")
      // console.log(userFundsProcessed)
    },
    // [actions.CREATE_FUND]: async function ({
    //   commit,
    //   dispatch,
    //   state
    // }, params) {
    //   console.log("IN FUND CALL")
    //   console.log(params)

    //   let tokenArray = Array(100).fill(null).map((u, i) => '0x0000000000000000000000000000000000000000')
    //   let weightingArray = Array(100).fill(null).map((u, i) => 0)

    //   let count = 0
    //   params.selected.forEach(function (token) {
    //     tokenArray[count] = token.tokenAddresses
    //     weightingArray[count] = token.ratio
    //     count++
    //   })

    //   console.log("VAA")
    //   console.log(tokenArray)
    //   console.log(weightingArray)



    //   let rebalanceMultiplier = 0
    //   switch (params.rebalanceEvery) {
    //     case 'hour':
    //       rebalanceMultiplier = 60 * 60
    //       break;
    //     case 'day':
    //       rebalanceMultiplier = 60 * 60 * 24
    //       break
    //     case 'week':
    //       rebalanceMultiplier = 60 * 60 * 24 * 7
    //       break
    //     case 'month':
    //       rebalanceMultiplier = 60 * 60 * 24 * 30
    //       break
    //   }
    //   let rebalancePeriod = rebalanceMultiplier * params.rebalancePeriod

    //   console.log("period")
    //   console.log(rebalancePeriod)

    //   let fundFactory = await FundFactory.at(state.factoryAddress)
    //   await fundFactory.createFund(tokenArray, weightingArray, rebalancePeriod, {
    //     from: state.account,
    //     value: state.web3.web3.utils.toWei(params.addedEther, "ether")
    //   })
    // }
  }
})