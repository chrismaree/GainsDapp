<template>
  <div class="page-container">
    <div class="md-layout">
      <h1>Create a sell contract</h1>
    </div>
    <p>Add your preferences to create an automatic market selling smart contract. There are a tone of different configurations to choose from. Experiment and see what the sell orders will look like with the interactive graph 🚀!</p>

    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label>Ether to sell</label>
          <md-input v-model="etherToSell" type="number"></md-input>
        </md-field>
        <step-size @sellSteps="sellSteps"/>
      </div>
      <div class="md-layout-item">
        <div v-if="plotData!=null && etherToSell!=0">
          <vue-plotly :data="plotData" :layout="plotLayout" :options="plotOptions"/>
        </div>
        <div v-if="etherToSell==0">
          <br>
          <md-empty-state
            md-rounded
            md-icon="account_balance_wallet"
            md-label="Enter the number of Ether to sell"
            md-description="Start off by entering how much Ether you want to sell."
          ></md-empty-state>
        </div>
      </div>
    </div>
    <br>
    <md-table style=": blue">
      <md-table-row>
        <md-table-head md-numeric>#</md-table-head>
        <md-table-head>Sell Percent</md-table-head>
        <md-table-head>Sell Price USD</md-table-head>
        <md-table-head>Sell Value USD</md-table-head>
        <md-table-head>Cumulative USD Sold</md-table-head>
        <md-table-head>Sell Value ETH</md-table-head>
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
  </div>
</template>

<script>
import ClickableAddress from "@/components/widgets/ClickableAddress";
import StepSize from "@/components/StepSize";
import VuePlotly from "@statnett/vue-plotly";

import { mapActions, mapState } from "vuex";

export default {
  name: "create",
  components: { ClickableAddress, StepSize, VuePlotly },
  data: () => ({
    etherToSell: 5,
    sellStepsObject: {},
    plotOptions: { responsive: true, showLink: false, displayModeBar: false }
  }),
  methods: {
    sellSteps(steps) {
      console.log("SELL STEPS");
      console.log(steps);
      console.log(steps.steps);
      //   this.series.data = steps.steps;
      this.sellStepsObject = steps;
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
        let cumulativePercent = [0];

        let tradeValue = [0];

        for (let i = 1; i < numberOfSteps; i++) {
          cumulativePercent.push(
            cumulativePercent[i - 1] + this.sellStepsObject.percentage[i]
          );

          tradeValue.push(this.etherToSell * this.sellStepsObject.steps[i - 1]);
        }

        cumulativePercent.push(100);
        tradeValue.push(
          this.etherToSell * this.sellStepsObject.steps[numberOfSteps - 1]
        );

        let xaxisSeries = [
          this.usdPrice - 100,
          ...this.sellStepsObject.steps,
          this.sellStepsObject.steps[numberOfSteps - 1] * 1.1
        ];
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
            name: "Trade Size"
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
            name: "Percent Sold",
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
    ...mapState(["usdPrice"])
  }
};
</script>
