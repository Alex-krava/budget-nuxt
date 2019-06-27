<template>
    <section>
      <form class="create-budget__form">
        <h3 class="create-budget__title">Add Transaction</h3>

        <label class="create-budget__label" for="target">Enter Target</label>
        <input class="create-budget__input" id="target" type="text" v-model.trim="target" @blur="$v.target.$touch()">
        <label class="create-budget__label" for="amount">Enter Amount</label>
        <span class="create-budget__input create-budget__input_container">
          <input class="create-budget__input" type="number" id="amount" v-model.trim="amount" @blur="$v.amount.$touch()">
          <select class="create-budget__input create-budget__input_currency" v-model.trim="currency" @blur="$v.currency.$touch()">
            <option v-for="(currency, index) in currencies" :key="index">{{currency}}</option>
          </select>
        </span>

        <span class="buttons-container">
          <input class="button" @click="closeModal()" type="button" value="Cancel">
          <input :disabled="$v.$invalid" class="button" type="button"
                 @click="addTransaction()" value="Add Transaction">
        </span>
      </form>
      <div class="create-budget__modal">
      </div>
    </section>
</template>

<script>
    import {required} from 'vuelidate/lib/validators'
    export default {
      data: () => ({
        currencies: process.env.currencies,
        target: '',
        amount: null,
        currency: (process.env.currencies.length) ? process.env.currencies[0] : ''
      }),
      methods: {
        closeModal() {
          this.$emit('close');
        },
        addTransaction() {
          if(!this.$v.$invalid) {
            this.$emit('create', {target: this.target, amount: this.amount, currency: this.currency});
          }
        }
      },
      validations: {
        target: {required},
        amount: {required},
        currency: {required}
      }
    }
</script>

<style lang="scss" scoped>
  .create-budget__modal {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(224,224,224, 0.7);
    z-index: 2;
  }

  .create-budget__form {
    width: 290px;
    max-height: 95%;
    padding: 15px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    background: #fff;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    overflow: auto;
  }

  .create-budget__title {
    margin: 0 0 10px;
  }

  .create-budget__label {
    font-size: 0.75em;
    color: #9E9E9E;
  }

  .create-budget__input {
    display: block;
    width: 100%;
    height: 28px;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid #E0E0E0;
    border-radius: 2px;
    margin-bottom: 10px;
  }

  .create-budget__input_container {
    display: flex;
    height: 28px;
    padding: 0;
    overflow: hidden;

    .create-budget__input {
      height: 26px;
      border: none;
      border-radius: 0;
      margin-bottom: 0;
      background-color: transparent;
    }

    .create-budget__input_currency {
      flex: 0 0 60px;
    }
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }

  .button {
    height: 28px;
    background: #fff;
    border: 1px solid #E0E0E0;
    box-sizing: border-box;
    border-radius: 2px;

    &:hover:not([disabled]) {
      background: #E0E0E0;
      color: #fff;
    }
  }
</style>
