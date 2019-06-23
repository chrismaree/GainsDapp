<template>
  <div class="page-container">
    <div class="md-layout">
      <h1>Create a sell Contract</h1>
    </div>
    <p>Spesify all the details of your automatic market selling smart contract</p>
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        {{sellMode}}
        <md-field>
          <label for="sellMode">Sell function</label>
          <md-select v-model="sellMode" name="sellMode" id="sellMode">
            <md-option value="equal-spaced">Equal Spaced</md-option>
            <md-option value="exponential">Exponential</md-option>
            <md-option value="fixed-Return">Fixed Returns</md-option>
          </md-select>
        </md-field>
        <equally-spaced v-if="sellMode == 'equal-spaced'" @sellSteps="sellSteps"/>
      </div>
      <div class="md-layout-item">
        <div v-if="plotValues!=null">
          <apexchart type="line" :options="plotValues.chartOptions" :series="plotValues.series"/>
          {{plotValues.series}}
          {{plotValues.series}}
        </div>
        <!-- {{series}} -->
        {{usdPrice}}
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import ClickableAddress from "@/components/widgets/ClickableAddress";
import EquallySpaced from "@/components/SellModes/EquallySpaced";
import { mapActions, mapState } from "vuex";

export default {
  name: "create",
  components: { ClickableAddress, EquallySpaced },
  data: () => ({
    sellMode: "equal-spaced",
    sellStepsObject: {}
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
    plotValues() {
      if (this.sellStepsObject.percentage) {
        let numberOfSteps = this.sellStepsObject.steps.length;
        let cumulativePercent = [];
        console.log("AAAAAA");
        console.log(this.sellStepsObject);
        cumulativePercent.push(0);
        for (let i = 1; i < this.sellStepsObject.steps.length; i++) {
          cumulativePercent.push(
            cumulativePercent[i - 1] + this.sellStepsObject.percentage[i]
          );
        }

        let xaxisSeries = [this.usdPrice, ...this.sellStepsObject.steps];
        return {
          series: [{ data: cumulativePercent }],
          chartOptions: {
            download: false,
            chart: {
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false
              }
            },
            dataLabels: {
              enabled: true
            },
            stroke: {
              curve: "stepline"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                opacity: 0.5
              }
            },
            xaxis: {
              categories: xaxisSeries
            },
            annotations: {
              xaxis: [
                {
                  x: 50,
                  strokeDashArray: 0,
                  borderColor: "#775DD0",
                  label: {
                    borderColor: "#775DD0",
                    style: {
                      color: "#fff",
                      background: "#775DD0"
                    },
                    text: "Current Price"
                  }
                }
              ]
            }
          }
        };
      }
      return null;
    },
    ...mapState(["usdPrice"])
  }
};
</script>
