<template>
  <div class="page-container">
    <md-steppers style="margin: 20px;" :md-active-step.sync="active" md-linear>
      <md-step
        id="first"
        md-label="Information"
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
                <div class="md-title">Specify how much Ether you want to sell</div>
              </md-card-header>
              This value will be sent to your smart contract and will be traded for Dai at the prices you choose. Choose either an exact number of percentage of your total stash.
              {{Math.round((etherSelectedToSell/etherBalance)*1000)/10}}
              <div class="md-layout">
                <div class="md-layout-item md-size-50">
                  <md-radio
                    v-model="inputMode"
                    value="exact"
                    @change="etherSelectedToSell = Math.round((percentageSelected/100*etherBalance*10))/10"
                  >Exact number of Ether</md-radio>
                </div>
                <div class="md-layout-item md-size-50">
                  <md-radio
                    v-model="inputMode"
                    value="percent"
                    @change="percentageSelected = Math.round((etherSelectedToSell/etherBalance)*1000)/10"
                  >Percent of stack</md-radio>
                </div>
              </div>
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
                      />
                    </div>
                  </div>
                  <div class="md-layout-item">Ether to trade: Ξ{{percentageToTrade}}</div>
                </div>
              </div>
            </md-content>
          </div>
          <div class="md-layout-item">
            <md-content style="padding: 20px;">
              <md-card-header>
                <div class="md-title">Sell ladder function</div>
              </md-card-header>
            </md-content>
          </div>
        </div>
        <md-button
          class="md-raised md-primary"
          @click="setDone('first', 'second'); etherToSell = etherSelectedToSell"
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
              <p>Add your preferences to create an automatic market selling smart contract. Specify how much ether you want to sell, and then select the sell ladder function you want to use. Experiment and see what the sell orders will look like with the interactive graph🚀!</p>
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
          <md-content style="margin-top:22px; padding:30px">
            <div class="md-layout md-alignment-top-center md-gutter">
              <div class="md-layout-item">
                <span class="md-subheading">Final sell price:${{finalValues.price.toFixed(2)}}</span>
                <br />
              </div>
              <div class="md-layout-item">
                <span class="md-subheading">Total value sold:${{finalValues.total.toFixed(2)}}</span>
                <br />
              </div>
              <div class="md-layout-item md-alignment-center-right">
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
            <div class="md-title">Review all the trades</div>
          </md-card-header>
          <p>The table below shows all trades that will be preformed. Note that it is possible that your upper bound in trade price will not be reached and so the cumulative values are shown to show the net values at this price point.🔍</p>
          <md-table>
            <md-table-row>
              <md-table-head md-numeric>#</md-table-head>
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
          <hr />If you are happy with all your trades you can continue to deploying your contract review and deploy all your sell contract settings.
          <br />
          <br />
          <md-button class="md-raised md-primary" @click="setDone('third', 'fourth')">Continue</md-button>
          <md-button class="md-raised" @click="setDone('third', 'second')">Back</md-button>
        </md-content>
      </md-step>
      <md-step
        id="fourth"
        :md-done.sync="fourth"
        md-label="Deploy"
        style="background: #F0F2F5; padding-left:0px; marin:0px; padding-right:0px;"
      >
        <md-content style="padding: 20px;">
          <md-card-header>
            <div class="md-title">Review sell contract information and deploy contract</div>
          </md-card-header>

          <md-button class="md-raised md-primary" @click="console.log('AAAA')">Deploy</md-button>
          <md-button class="md-raised" @click="setDone('fourth', 'third')">Back</md-button>
        </md-content>
      </md-step>
    </md-steppers>

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
    etherSelectedToSell: 5,
    etherToSell: 5,
    sellStepsObject: {},
    plotOptions: { responsive: true, showLink: false, displayModeBar: false },
    mode: "pick",
    active: "first",
    first: false,
    second: false,
    third: false,
    fourth: false,
    inputMode: "exact",
    etherBalance: 50.0191,
    percentageSelected: 20
  }),
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
          l: 40,
          r: 40,
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
        let xaxisSeries = this.sellStepsObject.steps;
        xaxisSeries.unshift(this.usdPrice - 100);

        console.log("CUM");
        console.log(cumulativePercent);
        console.log(cumulativePercent[numberOfSteps]);
        return [
          {
            x: xaxisSeries,
            y: tradeValue,
            marker: {
              color: "#B3BF59",
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
    percentageToTrade() {
      return ((this.percentageSelected / 100) * this.etherBalance).toFixed(4);
    },
    ...mapState(["usdPrice"])
  }
};
</script>
