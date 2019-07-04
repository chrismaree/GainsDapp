<template>
  <div class="home">
    <div class="md-layout md-gutter">
      <div class="md-layout-item" style="padding-top:100px; padding-left:150px">
        <span class="md-display-3">Secure your profits in the next bull run</span>
        <p style="padding-top:20px">
          Trustless, automatic, smart contract managed sell orders.
          <br />
          <br />Gradually exit your crypto position in the next bull run without needing to deposit or keep crypto onto an exchange. All funds are stored within your own smart contract.
          <br />
          <br />
          <md-button class="md-raised md-primary" @click="goToBegin" style="margin-top:25px">Begin</md-button>
          <md-button class="md-raised" @click="goToCreate" style="margin-top:25px">Learn More</md-button>
        </p>
      </div>
      <div class="md-layout-item md-size-40">
        <img
          class="text-center"
          alt="step logo"
          style="height:500px;"
          src="../assets/MoonSteps.png"
        />
      </div>
    </div>
    <div class="md-layout md-gutter" style="padding-top:25px">
      <div class="md-layout-item text-center">
        <img class="text-center" alt="step logo" style="height:85px;" src="../assets/012-login.png" />
        <p
          class="text-center"
        >Securely store your crypto in a smart contract until selling. Funds are sent directly back to you so you can send directly to hardware wallet.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/007-arithmetic.png"
        />
        <p
          class="text-center"
        >Automatically calculate all sell steps and amounts between now and your target price making exiting easier and safer. Understand your exact exact returns upfront.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/008-ethereum.png"
        />
        <p
          class="text-center"
        >Deploy and forget about it. All trades happens automatically for free through your smart contract that trades with decentralized exchanges on your behalf.</p>
      </div>
      <div class="md-layout-item">
        <img
          class="text-center"
          alt="step logo"
          style="height:85px;"
          src="../assets/005-rising.png"
        />
        <p
          class="text-center"
        >Sell your Ether into Dai or cDai automatically over your chosen sell range. Start earning interest on your realized profits immediately.</p>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item" style="padding-top:50px; padding-left:50px">
        <span class="md-display-2">Did you miss out on taking profits in the last bull run?</span>
        <p
          style="padding-top:5px"
        >For a lot of people this was because they did not enter the bull run with a plan on how to exit. Understanding and committing to the price you want to sell at before the markets start moving is important to not get lost in the euphoria of a bull market. Put your peg in the sand today and choose how much crypto you want to sell on the way up to lock in your profits.</p>
      </div>

      <div class="md-layout-item" style="padding-top:50px; padding-right:50px">
        <md-content
          style="padding: 5px; padding-right:20px; padding-left:20px; margin-bottom: 20px; cursor: pointer;"
          md-with-hover
        >
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <img
                class="text-center"
                alt="step logo"
                style="height:60px;margin-top:25px"
                src="../assets/005-rising.png"
              />
            </div>
            <div class="md-layout-item">
              <h3>Importance of taking profits during a bull run</h3>
              <p>Sitting on the sidelines just hodling is not always the best strategy. At some point you need to realize your gains.</p>
            </div>
          </div>
        </md-content>
        <md-content
          style="padding: 5px; padding-right:20px; padding-left:20px; margin-bottom: 20px; cursor: pointer;"
          md-with-hover
        >
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-size-15">
              <img
                class="text-center"
                alt="step logo"
                style="height:60px;margin-top:25px"
                src="../assets/003-rocket.png"
              />
            </div>
            <div class="md-layout-item">
              <h3>How MoonSteps.space works under the hood</h3>
              <p>Break down of the implementation details of the smart contracts and automated trading mechanism.</p>
            </div>
          </div>
        </md-content>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
export default {
  name: "home",
  methods: {
    goToBegin() {
      router.push({ name: "create" });
    }
  }
};
</script>


