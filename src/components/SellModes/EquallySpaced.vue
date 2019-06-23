<template>
  <div class="page-container">
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <p>
          <span
            class="md-caption"
          >Sell all ether over a set of equally space equal sells from a chosen starting price.</span>
        </p>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Starting price</label>
          <md-input v-model="startingPrice" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>
        <vue-slider
          v-model="startingPrice"
          :min="usdPrice"
          :max="2000"
          :adsorb="true"
          :interval="10"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Number of steps</label>
          <md-input v-model="numberOfSteps" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>
        <vue-slider v-model="numberOfSteps" :adsorb="true" :interval="1" :min="2" :max="20"/>
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-20">
        <md-field>
          <label>Price Per Steps</label>
          <md-input v-model="pricePerStep" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>
        <vue-slider v-model="pricePerStep" :min="50" :max="500" :adsorb="true" :interval="10"/>
      </div>
      {{sellSteps}}
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "equallySpaced",
  data: () => ({
    startingPrice: 500,
    numberOfSteps: 10,
    pricePerStep: 200
  }),
  computed: {
    sellSteps() {
      let sells = { steps: [], percentage: [] };
      for (let i = 0; i < this.numberOfSteps; i++) {
        let sellPrice = this.startingPrice + i * this.pricePerStep;
        sells.steps.push(sellPrice);
        sells.percentage.push(+parseFloat(100 / this.numberOfSteps).toFixed(3));
      }
      let arrSum = sells.percentage.reduce((a, b) => a + b, 0);
      let diff = 100.0 - arrSum;
      sells.percentage[this.numberOfSteps - 1] += diff;

      console.log("diff");
      console.log(diff);
      console.log("LAST");
      console.log(sells.percentage[sells.percentage.length]);

      this.$emit("sellSteps", sells);
      return sells;
    },
    ...mapState(["usdPrice"])
  }
};
</script>
