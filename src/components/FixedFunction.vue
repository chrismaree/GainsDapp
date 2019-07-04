<template>
  <div class="page-container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <p></p>
        <p>Specify your start and end price and the number of steps you want in between. You can pick to have your sells run at a constant sale (constant in ETH) size or a constant sales return (constant in USD).⚖️</p>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Starting price</label>
          <md-input v-model="startingPrice" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item p-t-1">
        <br />
        <br />
        <vue-slider
          v-model="startingPrice"
          :min="usdPrice"
          :max="1000"
          :adsorb="true"
          :interval="50"
          :tooltip="'always'"
          :process-style="{ backgroundColor: '#798288' }"
          :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Ending price</label>
          <md-input v-model="endingPrice" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br />
        <br />
        <vue-slider
          v-model="endingPrice"
          :min="usdPrice"
          :max="5000"
          :adsorb="true"
          :interval="50"
          :tooltip="'always'"
          :process-style="{ backgroundColor: '#798288' }"
          :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Number of steps</label>
          <md-input v-model="numberOfSteps" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br />
        <br />
        <vue-slider
          v-model="numberOfSteps"
          :adsorb="true"
          :interval="1"
          :min="2"
          :tooltip="'always'"
          :process-style="{ backgroundColor: '#798288' }"
          :tooltip-style="{ backgroundColor: '#646B71', borderColor: '#646B71' }"
          :max="20"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-50">
        <md-radio v-model="sellMode" value="constantSaleSize">Constant sale size</md-radio>
      </div>
      <div class="md-layout-item md-size-50">
        <md-radio v-model="sellMode" value="constantReturnSize">Constant return size</md-radio>
      </div>
    </div>
    {{sellSteps}}
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "StepSize",
  data: () => ({
    startingPrice: 500,
    endingPrice: 2000,
    numberOfSteps: 10,
    increaseFactor: 1,
    sellMode: "constantSaleSize"
  }),
  computed: {
    sellSteps() {
      let sells = { steps: [], percentage: [] };
      for (let i = 0; i < this.numberOfSteps; i++) {
        let stepSize =
          (this.endingPrice - this.startingPrice) / (this.numberOfSteps - 1);
        let sellPrice = this.startingPrice + stepSize * i;
        sells.steps.push(sellPrice);

        sells.percentage.push(+parseFloat(100 / this.numberOfSteps).toFixed(3));
      }

      if (this.sellMode == "constantReturnSize") {
        let equalSales = [];
        for (let i = 0; i < this.numberOfSteps; i++) {
          equalSales[i] = 1 / sells.steps[i];
        }
        console.log("EQUAL");
        console.log(equalSales);

        let equalSalesSum = equalSales.reduce((a, b) => a + b, 0);
        equalSales = equalSales.map(x => x * (100 / equalSalesSum));
        sells.percentage = equalSales;
      }
      //make sure that if there is any missing percents we add them back to the last trade
      let arrSum = sells.percentage.reduce((a, b) => a + b, 0);
      let diff = 100.0 - arrSum;
      sells.percentage[this.numberOfSteps - 1] += diff;
      this.$emit("sellSteps", sells);

      return "";
    },
    ...mapState(["usdPrice"])
  }
};
</script>
