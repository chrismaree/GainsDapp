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
        <md-field>
          <label for="sellMode">Sell function</label>
          <md-select v-model="sellMode" name="sellMode" id="sellMode">
            <md-option value="equal-spaced">Equal Spaced, equal sells</md-option>
            <md-option value="exponential">Exponential</md-option>
            <md-option value="fixed-Return">Fixed Returns</md-option>
          </md-select>
        </md-field>
        <equally-spaced v-if="sellMode == 'equal-spaced'" @sellSteps="sellSteps"/>
      </div>
      <div class="md-layout-item">
        <div v-if="plotData!=null">
          <md-switch v-model="showTotal" value="1">Show Cumulative Value</md-switch>
          <vue-plotly :data="plotData" :layout="plotLayout" :options="plotOptions"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickableAddress from "@/components/widgets/ClickableAddress";
import EquallySpaced from "@/components/SellModes/EquallySpaced";
import VuePlotly from "@statnett/vue-plotly";

import { mapActions, mapState } from "vuex";

export default {
  name: "create",
  components: { ClickableAddress, EquallySpaced, VuePlotly },
  data: () => ({
    etherToSell: 5,
    sellMode: "equal-spaced",
    sellStepsObject: {},
    plotOptions: { responsive: true, showLink: false, displayModeBar: false },
    showTotal: false
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
          title: "Percentage Sold(%)",
          gridcolor: "#bdbdbd",
          dtick: 10
        },
        yaxis2: {
          title: "Total Value Sold(USD)",
          overlaying: "y",
          side: "right",
          autorange: true,
          showgrid: true,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: "",
          showticklabels: true
        },
        margin: {
          l: 40,
          r: 55 * this.showTotal,
          b: 55,
          t: 0,
          pad: 5
        },
        shapes: [
          {
            type: "line",
            x0: this.usdPrice,
            y0: 0,
            x1: this.usdPrice,
            y1: 100,
            line: {
              color: "red",
              width: 3
            }
          }
        ],
        annotations: [
          {
            x: this.usdPrice + 50,
            y: 50,
            xref: "x",
            yref: "y",
            text: "Current Ether Price",
            ax: 0,
            ay: -40,
            textangle: "90"
          }
        ],
        showlegend: false
      };
    },
    plotData() {
      if (this.sellStepsObject.percentage) {
        let numberOfSteps = this.sellStepsObject.percentage.length;
        let cumulativePercent = [0];
        let cumulativeValue = [0];

        for (let i = 1; i < numberOfSteps; i++) {
          cumulativePercent.push(
            cumulativePercent[i - 1] + this.sellStepsObject.percentage[i]
          );
          cumulativeValue.push(
            ((this.etherToSell * cumulativePercent[i - 1]) / 100) *
              this.sellStepsObject.steps[i]
          );
        }

        cumulativePercent.push(100);
        cumulativePercent.push(100);

        // cumulativeValue.push(
        //   ((this.etherToSell * cumulativePercent[numberOfSteps - 1]) / 100) *
        //     this.sellStepsObject.steps[numberOfSteps - 1]
        // );

        cumulativeValue.push(
          ((this.etherToSell * cumulativePercent[numberOfSteps]) / 100) *
            this.sellStepsObject.steps[numberOfSteps - 1]
        );

        cumulativeValue.push(
          ((this.etherToSell * cumulativePercent[numberOfSteps]) / 100) *
            this.sellStepsObject.steps[numberOfSteps - 1]
        );

        let xaxisSeries = [
          this.usdPrice - 100,
          ...this.sellStepsObject.steps,
          this.sellStepsObject.steps[numberOfSteps - 1] * 1.1
        ];
        console.log("X-values");
        console.log(cumulativeValue);

        console.log("CUM");
        console.log(cumulativePercent);
        console.log(cumulativePercent[numberOfSteps]);

        if (this.showTotal) {
          return [
            {
              x: xaxisSeries,
              y: cumulativePercent,
              mode: "lines+markers",
              name: "Percent Sold",
              line: { shape: "hv" },
              type: "scatter"
            },
            {
              x: xaxisSeries,
              y: cumulativeValue,
              yaxis: "y2",
              mode: "lines+markers",
              name: "Value Sold",
              line: { shape: "hv" },
              type: "scatter"
            }
          ];
        } else {
          return [
            {
              x: xaxisSeries,
              y: cumulativePercent,
              mode: "lines+markers",
              name: "Percent Sold",
              line: { shape: "hv" },
              type: "scatter"
            }
          ];
        }
      }
      return null;
    },
    ...mapState(["usdPrice"])
  }
};
</script>
