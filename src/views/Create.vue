<template>
  <div class="page-container">
    <md-steppers style="margin: 20px;" :md-active-step.sync="active" md-linear>
      <md-step
        id="first"
        md-label="Information & setup"
        :md-done.sync="first"
        style="background: #F0F2F5; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Create your own sell contract</div>
              </md-card-header>
              <p>Create your own custom sell contract by defining exact parameters to trigger your crypto sells. Each of the steps that follow will guide you in building your sell contract which will exit your position gradually over a range of prices as the Ether price increase.🌝</p>
              <p>
                At the end of the process a smart contract is deployed which will store your Ether and will trade automatically with
                <a
                  href="https://uniswap.io"
                >UniSwap</a> as and when the Ether price hits your sell targets. At any point in time you can deposit into or withdraw from from your sell contract, modify the sell prices and amounts or change other parameters.
                To learn more about the implementation details check out the
                <a
                  href="https://"
                >Docs</a>.
              </p>
            </md-content>
          </div>
        </div>
        <br />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Ether to sell</div>
              </md-card-header>This value will be sent to your smart contract and will be traded for Dai at the prices you choose. Choose either an exact number of percentage of your total stash💸.
              <md-radio
                v-model="inputMode"
                value="exact"
                @change="etherSelectedToSell = Math.round((percentageSelected/100*etherBalance*10))/10"
              >Exact number of Ether</md-radio>
              <md-radio
                v-model="inputMode"
                value="percent"
                @change="percentageSelected = Math.round((etherSelectedToSell/etherBalance)*1000)/10"
              >Percent of stack</md-radio>
              <div class="md-layout">
                <div class="md-layout-item md-size-30">
                  Your ballance:
                  <br />
                  Ξ{{etherBalance}}
                  <br />
                  <md-button
                    class="md-dense md-primary"
                    style="margin-left:0px;"
                    @click="etherSelectedToSell = Math.round(etherBalance); percentageSelected=100"
                  >Max</md-button>
                </div>
                <div class="md-layout-item md-size-70" v-if="inputMode=='exact'">
                  <div class="md-layout">
                    <div class="md-layout-item md-size-40">
                      <md-field>
                        <label>Ether to sell</label>
                        <md-input v-model="etherSelectedToSell" type="number"></md-input>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-60">
                      <br />
                      <br />
                      <vue-slider
                        v-model="etherSelectedToSell"
                        :min="0.1"
                        :max="Math.round(etherBalance)"
                        :interval="0.1"
                        :adsorb="true"
                        :tooltip="'always'"
                        :process-style="{ backgroundColor: '#798288' }"
                        :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
                      />
                    </div>
                  </div>
                </div>
                <div class="md-layout-item md-size-70" v-if="inputMode=='percent'">
                  <div class="md-layout">
                    <div class="md-layout-item md-size-40">
                      <md-field>
                        <label>Percentage of stack</label>
                        <md-input v-model="percentageSelected" type="number"></md-input>
                      </md-field>
                    </div>
                    <div class="md-layout-item md-size-60">
                      <br />
                      <br />
                      <vue-slider
                        v-model="percentageSelected"
                        :min="0.1"
                        :max="100"
                        :interval="0.1"
                        :adsorb="true"
                        :tooltip="'always'"
                        :process-style="{ backgroundColor: '#798288' }"
                        :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
                      />
                    </div>
                  </div>
                  <div class="md-layout-item">Ether to sell: Ξ{{valueFromPercentToTrade}}</div>
                </div>
              </div>
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Recipient Wallet</div>
              </md-card-header>
              <p>Send ether back to your currently unlocked web3 wallet or to a different address, such as a hardware wallet💰.</p>

              <md-radio v-model="wallet" value="own">Current wallet address</md-radio>
              <md-radio v-model="wallet" value="other" @change="recipientAddress=''">Other address</md-radio>

              <div class="md-layout">
                <div class="md-layout-item md-size-50"></div>
              </div>

              <div class="md-layout-item md-size-70" v-if="wallet=='own'">
                <clickable-address :light="false" :eth-address="account" style="margin-top:0px" />
                <br />
              </div>
              <div class="md-layout-item md-size-70" v-if="wallet=='other'">
                <md-field style="margin-top:0px">
                  <label>Recipient Address</label>
                  <md-input v-model="recipientAddress"></md-input>
                </md-field>
              </div>
            </md-content>
          </div>
        </div>
        <br />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Select token to sell into</div>
              </md-card-header>
              <p>
                Each trade can be made to either Dai or cDai. Dai has a stable value of 1 USD and can be traded for other crypto currencies or exchanged for Fiat. cDai represents fractional ownership in a
                <a
                  href="https://compound.finance"
                >Compound Finance</a> lending pool which means you start earning interest on your Dai immediately after a sale 🤘!
              </p>
              <md-radio v-model="daiMode" value="Dai">Dai</md-radio>
              <md-radio v-model="daiMode" value="cDai">cDai</md-radio>
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Configure commitment lock</div>
              </md-card-header>
              <p>All too often during a bull market people will cancel their sell orders on the way up. The commitment lock places a cool down on executing a withdraw or edit of trade settings. This makes it harder to back out once you've committed to your sell prices, ensuring that your crypto gets sold at the price you selected🔐!</p>
              <md-radio v-model="commitment" value="no">No Commitment lock</md-radio>
              <md-radio v-model="commitment" value="lock">Set lock period</md-radio>

              <div class="md-layout" v-if="commitment=='lock'">
                <div class="md-layout-item md-size-40">
                  <md-field>
                    <label>Cool down on withdraw(days)</label>
                    <md-input v-model="coolDownOnWithdraw" type="number"></md-input>
                  </md-field>
                </div>
                <div class="md-layout-item md-size-60">
                  <br />
                  <br />
                  <vue-slider
                    v-model="coolDownOnWithdraw"
                    :min="1"
                    :max="50"
                    :interval="1"
                    :adsorb="true"
                    :tooltip="'always'"
                    :process-style="{ backgroundColor: '#798288' }"
                    :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
                  />
                </div>
              </div>
            </md-content>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="setDone('first', 'second'); etherToSell = etherSelectedToSell; if(wallet=='own'){recipientAddress=account}"
          :disabled="wallet =='other' && recipientAddress.length!=42"
          style="margin-top: 20px;"
        >Continue</md-button>
      </md-step>

      <md-step
        id="second"
        :md-done.sync="second"
        md-label="Sell function"
        style="background: #F0F2F5; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <div class="md-layout">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Sell ladder function</div>
              </md-card-header>
              <p>Add your preferences to create an automatic market selling smart contract. Specify how much ether you want to sell, and then select the sell ladder function you want to use. Experiment and see what the sell orders will look like with the interactive graph📊.</p>
            </md-content>
          </div>
        </div>
        <br />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Choose sale ladder function</div>
              </md-card-header>
              <md-field>
                <label for="mode">Select sell contract sell function type</label>
                <md-select v-model="mode" name="mode" id="mode">
                  <md-option value="pick">Choose Start, End, Steps</md-option>
                  <md-option value="custom">Custom Sell Function</md-option>
                </md-select>
              </md-field>

              <custom-function @sellSteps="sellSteps" v-if="mode=='custom'" />
              <fixed-function @sellSteps="sellSteps" v-if="mode=='pick'" />
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Trade size and % sold</div>
              </md-card-header>
              <div v-if="plotData!=null && etherToSell!=0">
                <vue-plotly :data="plotData" :layout="plotLayout" :options="plotOptions" />
              </div>
              <div v-if="etherToSell==0">
                <br />
                <md-empty-state
                  md-rounded
                  md-icon="account_balance_wallet"
                  md-label="Enter the number of Ether to sell"
                  md-description="Start off by entering how much Ether you want to sell."
                ></md-empty-state>
              </div>
            </md-content>
          </div>
        </div>
        <div v-if="finalValues!=null">
          <md-content style="margin-top:22px; padding-top:20px">
            <div class="md-layout md-gutter">
              <div class="md-layout-item">
                <span
                  class="md-subheading text-center"
                >Final sell price:${{finalValues.price.toFixed(2)}}</span>
                <br />
              </div>
              <div class="md-layout-item">
                <span
                  class="md-subheading text-center"
                >Total value sold:${{finalValues.total.toFixed(2)}}</span>
                <br />
              </div>
              <div class="md-layout-item text-center">
                <span
                  class="md-subheading"
                >Average USD/Eth:${{(finalValues.total/etherToSell).toFixed(2)}}</span>
                <br />
              </div>
            </div>
            <!-- <hr /> -->
            <!-- <p>If you are happy with the look of your sell ladder you can continue to review the exact details of the trades that will be preformed.</p> -->
          </md-content>
          <md-button
            class="md-raised md-primary"
            @click="setDone('second', 'third')"
            style="margin-top: 20px;"
          >Continue</md-button>
          <md-button
            class="md-raised"
            @click="setDone('second', 'first')"
            style="margin-top: 20px;"
          >Back</md-button>
        </div>
      </md-step>

      <md-step
        id="third"
        :md-done.sync="third"
        md-label="Review trades"
        style="background: #F0F2F5; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <md-content style="padding: 20px;">
          <md-card-header>
            <div class="md-title">Review trades</div>
          </md-card-header>
          <p>The table below shows all trades that will be preformed. Note that it is possible that your upper bound in trade price will not be reached and so the cumulative values are shown to show the net values at this price point.🔍</p>
          <md-table>
            <md-table-row>
              <md-table-head md-numeric>Trade #</md-table-head>
              <md-table-head>Sell Percent</md-table-head>
              <md-table-head>Sell Price USD</md-table-head>
              <md-table-head>Sell Value USD</md-table-head>
              <md-table-head>Cumulative USD Sold</md-table-head>
              <md-table-head>Sell Value in ETH</md-table-head>
              <md-table-head>Cumulative ETH Sold</md-table-head>
            </md-table-row>

            <md-table-row v-for="(trade,index) in tableData" :key="trade.index">
              <md-table-cell md-numeric>{{index+1}}</md-table-cell>
              <md-table-cell>{{trade.percentage.toFixed(2)}}</md-table-cell>
              <md-table-cell>{{trade.sellPriceUSD.toFixed(2)}}</md-table-cell>
              <md-table-cell>{{trade.sellValueUSD.toFixed(2)}}</md-table-cell>
              <md-table-cell>{{trade.cumUSDSold.toFixed(2)}}</md-table-cell>
              <md-table-cell>{{trade.ethSoldAtTrade.toFixed(2)}}</md-table-cell>
              <md-table-cell>{{trade.cumEtherSold.toFixed(2)}}</md-table-cell>
            </md-table-row>
          </md-table>
        </md-content>
        <br />
        <md-button class="md-raised md-primary" @click="setDone('third', 'fourth')">Continue</md-button>
        <md-button class="md-raised" @click="setDone('third', 'second')">Back</md-button>
      </md-step>
      <md-step
        id="fourth"
        :md-done.sync="fourth"
        md-label="Deploy"
        style="background: #F0F2F5; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <md-content style="padding: 20px;">
          <md-card-header>
            <div class="md-title">Review sell contract information and deploy contract!</div>
          </md-card-header>
          <p>Before deploying your sell contract you can review all key information. You will always be able to change these values later, add(or remove funds) and change sale periods.</p>
        </md-content>
        <br />
        <div class="md-layout md-gutter">
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Sell contract summary information</div>
              </md-card-header>
              <md-table v-if="plotData!=null">
                <md-table-row>
                  <md-table-cell>Ether to sell</md-table-cell>
                  <md-table-cell>Ξ {{etherToSell.toFixed(4)}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Recipient wallet</md-table-cell>
                  <md-table-cell>
                    <div class="md-layout">
                      <div class="md-layout-item">
                        <clickable-address
                          :light="false"
                          :eth-address="recipientAddress"
                          style="margin-top:0px"
                        />
                      </div>
                      <div class="md-layout-item">
                        <p style="margin:0px" v-if="wallet=='own'">(my wallet)</p>
                        <p style="margin:0px" v-if="wallet=='other'">(selected wallet)</p>
                      </div>
                    </div>
                  </md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Receive token</md-table-cell>
                  <md-table-cell>{{daiMode}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Commitment lock</md-table-cell>
                  <md-table-cell>
                    <p style="margin:0px" v-if="commitment=='yes'">{{coolDownOnWithdraw}} days</p>
                    <p style="margin:0px" v-if="commitment=='no'">None set</p>
                  </md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Number of trades</md-table-cell>
                  <md-table-cell>{{this.sellStepsObject.steps.length - 1}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Start sell price</md-table-cell>
                  <md-table-cell>$ {{this.sellStepsObject.steps[0].toFixed(2)}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Final sell price</md-table-cell>
                  <md-table-cell>$ {{finalValues.price.toFixed(2)}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Total sold in USD</md-table-cell>
                  <md-table-cell>$ {{finalValues.total.toFixed(2)}}</md-table-cell>
                </md-table-row>
                <md-table-row>
                  <md-table-cell>Average sell USD/Eth</md-table-cell>
                  <md-table-cell>$ {{(finalValues.total/etherToSell).toFixed(2)}}</md-table-cell>
                </md-table-row>
              </md-table>
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Sell ladder function</div>
              </md-card-header>
              <div v-if="plotData!=null && etherToSell!=0">
                <vue-plotly :data="plotData" :layout="plotLayout" :options="plotOptions" />
              </div>
            </md-content>
          </div>
        </div>
        <br />
        <md-button class="md-raised md-primary" @click="showLaunch = true">Deploy🚀</md-button>
        <md-button class="md-raised" @click="setDone('fourth', 'third')">Back</md-button>
      </md-step>
    </md-steppers>
    <md-dialog-alert
      :md-active.sync="showLaunch"
      md-title="Sell contract creation is disabled for now..."
      md-content="We are working hard to finish up testing the smart contracts to enable launching your own sell contracts. " />
    <br />
  </div>
</template>

<script>
import ClickableAddress from "@/components/widgets/ClickableAddress";
import CustomFunction from "@/components/CustomFunction";
import FixedFunction from "@/components/FixedFunction";
import VuePlotly from "@statnett/vue-plotly";

import { mapActions, mapState } from "vuex";

export default {
  name: "create",
  components: { ClickableAddress, CustomFunction, FixedFunction, VuePlotly },
  data: () => ({
    showLaunch: false,
    etherSelectedToSell: 5,
    etherToSell: 5,
    sellStepsObject: {},
    plotOptions: {
      responsive: true,
      showLink: false,
      displayModeBar: false
    },
    mode: "pick",
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    inputMode: "exact",
    etherBalance: 50.0191,
    percentageSelected: 20,
    wallet: "own",
    recipientAddress: "0x",
    daiMode: "Dai",
    commitment: "no",
    coolDownOnWithdraw: 5
  }),
  mounted() {
    // this.recipientAddress = this.account;
  },
  methods: {
    sellSteps(steps) {
      console.log("SELL STEPS");
      console.log(steps);
      this.sellStepsObject = steps;
    },
    setDone(id, index) {
      this[id] = true;

      this.secondStepError = null;

      if (index) {
        this.active = index;
      }
    }
  },
  computed: {
    plotLayout() {
      let xtick =
        (this.sellStepsObject.steps[this.sellStepsObject.steps.length - 1] -
          this.sellStepsObject.steps[0]) /
        10;
      console.log("TICK");
      console.log(xtick);
      return {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        xaxis: {
          title: "Ether Price",
          gridcolor: "#bdbdbd",
          dtick: xtick
        },
        yaxis: {
          title: "Trade Size(USD)",
          gridcolor: "#bdbdbd",
          showticklabels: true
        },
        yaxis2: {
          title: "Percentage Sold(%)",
          overlaying: "y",
          side: "right",
          autorange: true,
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: "",
          showticklabels: true,
          dtick: 10
        },
        margin: {
          l: 55,
          r: 55,
          b: 55,
          t: 10,
          pad: 5
        },
        shapes: [
          {
            type: "line",
            x0: this.usdPrice,
            y0: 0,
            x1: this.usdPrice,
            y1: 100,
            xref: "x",
            yref: "y2",
            line: {
              color: "red",
              width: 3
            }
          }
        ],
        annotations: [
          {
            x: this.usdPrice - 50,
            y: 40,
            xref: "x",
            yref: "y2",
            text: "Current Ether Price",
            ax: 0,
            ay: -40,
            textangle: "-90"
          }
        ],
        showlegend: true,
        legend: {
          x: 0,
          y: 1,
          font: {
            family: "sans-serif",
            size: 12,
            color: "#000"
          },
          bgcolor: "#F0F2F5",
          bordercolor: "#F0F2F5",
          borderwidth: 2
        }
      };
    },
    plotData() {
      if (this.sellStepsObject.percentage) {
        let numberOfSteps = this.sellStepsObject.percentage.length;
        let cumulativePercent = [];
        let tradeValue = [];

        // cumulativePercent.push(this.sellStepsObject.percentage[0]);
        // tradeValue.push(
        //   ((this.etherToSell * this.sellStepsObject.percentage[0]) / 100) *
        //     this.sellStepsObject.steps[0]
        // );

        for (let i = 0; i < numberOfSteps; i++) {
          if (i == 0) {
            cumulativePercent.push(this.sellStepsObject.percentage[0]);
            tradeValue.push(
              ((this.etherToSell * this.sellStepsObject.percentage[0]) / 100) *
                this.sellStepsObject.steps[0]
            );
          } else {
            cumulativePercent.push(
              cumulativePercent[i - 1] + this.sellStepsObject.percentage[i]
            );

            tradeValue.push(
              ((this.etherToSell * this.sellStepsObject.percentage[i]) / 100) *
                this.sellStepsObject.steps[i]
            );
          }
        }

        cumulativePercent.unshift(0);
        tradeValue.unshift(0);

        //cast to json then back to make a deep copy. we want the xaxis to only be an extended
        // instance of the trade values, not a pointer to the underlying.
        let xaxisSeries = JSON.parse(
          JSON.stringify(this.sellStepsObject.steps)
        );
        xaxisSeries.unshift(this.usdPrice - 100);

        console.log("CUM");
        console.log(cumulativePercent);
        console.log(cumulativePercent[numberOfSteps]);
        return [
          {
            x: xaxisSeries,
            y: tradeValue,
            marker: {
              color: "#646B71",
              line: { color: "transparent" }
            },
            type: "bar",
            name: "Trade Size(USD)"
          },
          {
            x: xaxisSeries,
            y: cumulativePercent,
            marker: {
              color: "#059597",
              line: { color: "transparent" }
            },
            yaxis: "y2",
            mode: "lines+markers",
            name: "Percent Sold(ETH)",
            line: { shape: "hv" },
            type: "scatter"
          }
        ];
      }
      return null;
    },
    tableData() {
      if (this.sellStepsObject.percentage) {
        let trades = [];
        let cumEtherSold = 0;
        let cumUSDSold = 0;
        let numberOfSteps = this.sellStepsObject.percentage.length;
        for (let i = 0; i < numberOfSteps; i++) {
          cumEtherSold =
            (this.sellStepsObject.percentage[i] / 100) * this.etherToSell;
          cumUSDSold =
            (this.sellStepsObject.percentage[i] / 100) *
            this.etherToSell *
            this.sellStepsObject.steps[i];

          if (i != 0) {
            cumEtherSold += trades[i - 1].cumEtherSold;
            cumUSDSold += trades[i - 1].cumUSDSold;
          }
          trades.push({
            index: i,
            percentage: this.sellStepsObject.percentage[i],
            sellPriceUSD: this.sellStepsObject.steps[i],
            sellValueUSD:
              this.sellStepsObject.steps[i] *
              (this.sellStepsObject.percentage[i] / 100) *
              this.etherToSell,
            ethSoldAtTrade:
              (this.sellStepsObject.percentage[i] / 100) * this.etherToSell,
            cumEtherSold: cumEtherSold,
            cumUSDSold: cumUSDSold
          });
        }
        return trades;
      }
      return null;
    },
    finalValues() {
      if (this.sellStepsObject.percentage) {
        let numberOfSteps = this.sellStepsObject.percentage.length;
        return {
          total: this.tableData[numberOfSteps - 1].cumUSDSold,
          price: this.tableData[numberOfSteps - 1].sellPriceUSD
        };
      }
      return null;
    },
    valueFromPercentToTrade() {
      return ((this.percentageSelected / 100) * this.etherBalance).toFixed(4);
    },
    ...mapState(["usdPrice", "account"])
  }
};
</script>
