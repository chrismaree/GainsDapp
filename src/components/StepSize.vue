<template>
  <div class="page-container">
    {{sellSteps}}
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <p>
          <span
            class="md-caption"
          >Specify the size of the steps between sell orders. Choose the price you want to start selling at, the size per step and the increase(or decrease) per step. You can also choose the number of steps In total.📈</span>
        </p>
      </div>
    </div>

    <div class="md-layout">
      <div class="md-layout-item md-size-30">
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
          :max="1000"
          :adsorb="true"
          :interval="10"
          :tooltip="'always'"
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
        <br>
        <vue-slider
          v-model="numberOfSteps"
          :adsorb="true"
          :interval="1"
          :min="2"
          :tooltip="'always'"
          :max="20"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Step exponent</label>
          <md-input v-model="increaseFactor" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>

        <vue-slider
          v-model="increaseFactor"
          :min="0.5"
          :max="1.5"
          :adsorb="true"
          :tooltip="'always'"
          :interval="0.1"
        />
      </div>
    </div>
    <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Increase Per Step</label>
          <md-input v-model="pricePerStep" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>
        <vue-slider
          v-model="pricePerStep"
          :min="50"
          :max="500"
          :adsorb="true"
          :tooltip="'always'"
          :interval="10"
        />
      </div>
    </div>
    <!-- <div class="md-layout">
      <div class="md-layout-item md-size-30">
        <md-field>
          <label>Sell exponent</label>
          <md-input v-model="sellPercentFactor" type="number"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item">
        <br>
        <vue-slider
          v-model="sellPercentFactor"
          :min="0.5"
          :max="1.5"
          :adsorb="true"
          :tooltip="'always'"
          :interval="0.1"
        />
      </div>
    </div>-->
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "StepSize",
  data: () => ({
    startingPrice: 500,
    numberOfSteps: 10,
    pricePerStep: 200,
    increaseFactor: 1,
    sellPercentFactor: 1
  }),
  computed: {
    sellSteps() {
      let sells = { steps: [], percentage: [] };
      for (let i = 0; i < this.numberOfSteps; i++) {
        let sellPrice =
          this.startingPrice +
          this.pricePerStep * Math.pow(i, this.increaseFactor);
        sells.steps.push(sellPrice);
        sells.percentage.push(+parseFloat(100 / this.numberOfSteps).toFixed(3));
      }
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
