<template>
  <section>
    <form class="create-budget__form">
      <h3 class="create-budget__title">Create Budget</h3>

      <label class="create-budget__label" for="name">Enter Name Budget</label>
      <input class="create-budget__input" v-model.trim="name" @blur="$v.name.$touch()" id="name" type="text">
      <label class="create-budget__label" for="limit">Enter Limit Budget</label>
      <span class="create-budget__input create-budget__input_container">
        <input class="create-budget__input" v-model.trim="limit" @blur="$v.limit.$touch()" type="number" id="limit" value="1000">
        <select class="create-budget__input create-budget__input_currency" @blur="$v.currency.$touch()" v-model.trim="currency">
          <option v-for="(currency, index) in currencies" :key="index">{{currency}}</option>
        </select>
      </span>

      <span class="buttons-container">
        <input class="button" @click="closeModal()" type="button" value="Cancel">
        <input :disabled="$v.$invalid" class="button" type="button"
               @click="createBudget()" value="Create Budget">
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
        name: '',
        limit: 1000,
        currency: (process.env.currencies.length) ? process.env.currencies[0] : ''
      }),
      methods: {
        closeModal() {
          this.$emit('close');
        },
        createBudget() {
          if(!this.$v.$invalid) {
            this.$emit('create', {name: this.name, currency: this.currency, limit: this.limit});
          }
        }
      },
      validations: {
        name: {required},
        limit: {required},
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
