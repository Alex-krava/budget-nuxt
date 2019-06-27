<template>
    <section>
      <div class="details__container">
        <nuxt-link to="/budgets" class="details__close"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg></nuxt-link>
        <div class="warning" v-if="selectedBudget.remaining < 0">Limit exceeded on {{-selectedBudget.remaining}} {{selectedBudget.currency}}</div>
        <div class="details__card">
          <div class="details__name">
            {{selectedBudget.name}}
          </div>
          <div class="details__text">
            <span class="details__label">Limit:</span>
            <span>{{selectedBudget.limit}} {{selectedBudget.currency}}</span>
          </div>
          <div class="details__text">
            <span class="details__label">Remaining budget:</span>
            <span>{{selectedBudget.remaining}} {{selectedBudget.currency}}</span>
          </div>
          <div class="details__text">
            <span class="details__label">Average transaction amount:</span>
            <span>{{selectedBudget.averageAmount}} {{selectedBudget.currency}}</span>
          </div>
          <div class="details__text">
            <span class="details__label">Maximum transaction amount:</span>
            <span>{{selectedBudget.maximumAmount}} {{selectedBudget.currency}}</span>
          </div>
          <div class="details__text">
            <span class="details__label">Minimum transaction amount:</span>
            <span>{{selectedBudget.minimumAmount}} {{selectedBudget.currency}}</span>
          </div>

        </div>

        <ul class="details__list">
          <li v-if="(selectedBudget.remaining > 0)" @click="openModal()" class="details__add details__transaction">
            <span class="details__label details__label_icon">+</span>
            <span class="details__label">Add transaction</span>
          </li>
          <li v-for="(transaction, index) in (selectedBudget) ? selectedBudget.transactions : []" :key="index" class="details__transaction">
            <span class="details__row">
              <span class="details__label">Target: </span>
              <span>{{transaction.target}}</span>
            </span>
            <span class="details__row">
              <span class="details__label">Amount: </span>
              <span>{{transaction.amount}}</span>
            </span>
            <span class="details__row">
              <span class="details__label">Currency: </span>
              <span>{{transaction.currency}}</span>
            </span>

            <a @click="removeTransaction(index)" class="details__remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/>
              </svg>
            </a>
          </li>
        </ul>
        <add-transaction v-if="modalFormOpen" v-on:close="closeModal" v-on:create="addTransaction($event)"></add-transaction>
      </div>
    </section>
</template>

<script>
import { Decimal } from 'decimal.js';
import AddTransaction from '~/components/AddTransaction';

export default {
  components: {AddTransaction},
  middleware: ['budget'],
  computed: {
    selectedBudget() {
      const id = +this.$route.params.id;
      const budgets = this.$store.getters['budget/budgets'];
      let selectedBudget;
      budgets.some((budget) => {
        if(budget.id === id) {
          selectedBudget = budget;
        }
      });
      return selectedBudget;
    }
  },
  mounted() {
    this.intervalFunction = setInterval(() => this.transactionProcessing(), 30000);
  },
  destroyed() {
    clearInterval(this.intervalFunction);
  },
  data: () => ({
    modalFormOpen: false,
    intervalFunction() {  }
  }),
  methods: {
    openModal() {
      this.modalFormOpen = true;
    },
    closeModal() {
      this.modalFormOpen = false;
    },
    addTransaction(value) {
      const id = +this.$route.params.id;
      this.$store.commit('budget/addTransaction', {id: id, transaction: value});
      this.$store.dispatch('budget/saveBudgets');
      this.transactionProcessing();
      this.closeModal();
    },
    removeTransaction(index) {
      const id = +this.$route.params.id;
      this.$store.commit('budget/removeTransaction', {id: id, index: index});
      this.$store.dispatch('budget/saveBudgets');
      this.transactionProcessing();
    },
    async transactionProcessing() {
      const transactionsList = this.selectedBudget.transactions;
      const baseRate = this.selectedBudget.currency;
      const transactionAmounts = [];
      await this.$store.dispatch('exchange/fetchExchangeData', baseRate);
      const exchangeData = this.$store.getters['exchange/data'];
      transactionsList.forEach((transaction) => {
        const rate = transaction.currency;
        const sum = this.conversion(transaction.amount, exchangeData.rates[rate]);
        transactionAmounts.push(sum);
      });
      const newData = this.transactionCounting(this.selectedBudget.limit, transactionAmounts);
      this.$store.commit('budget/updateBudgets', {data: newData, id: +this.$route.params.id});
      this.$store.dispatch('budget/saveBudgets');
    },
    conversion(sum, rate) {
      const sumD = new Decimal(sum);
      const rateD = new Decimal(rate);
      const result = +sumD.dividedBy(rateD);
      return result;
    },
    transactionCounting(remainingProps, transactions) {
      const result = {
        remaining: remainingProps,
        average: 0,
        maximum: 0,
        minimum: 0
      };

      if (transactions.length) {
        const remaining = new Decimal(result.remaining);
        result.minimum = +Decimal.min(...transactions).toFixed(2);
        result.maximum = +Decimal.max(...transactions).toFixed(2);

        let sumTransactions = new Decimal(0);
        transactions.forEach((sum) => {
          sumTransactions = sumTransactions.plus(sum);
        });
        result.remaining = +remaining.minus(sumTransactions).toFixed(2);
        result.average = +sumTransactions.dividedBy(transactions.length).toFixed(2);
      }

      return result;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~assets/main';

  .details__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 15px;
  }

  .details__card {
    width: 35%;
    min-width: 290px;
    margin-top: 15px;
    padding: 15px 20px;
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    box-sizing: border-box;
  }

  .details__name {
    font-size: 1.5em;
    margin-bottom: 15px;
  }

  .details__text {
    display: flex;
    flex-direction: column;
    margin-bottom: 5px;
    overflow: hidden;
  }

  .details__label {
    font-size: 0.75em;
    color: #9E9E9E;
  }

  .details__label_icon {
    font-size: 25px;
  }

  .details__list {
    width: 35%;
    min-width: 290px;
    margin-top: 15px;

  .details__card {
    width: 100%;
    margin-top: 0;
  }
  }

  .details__add {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
    transition: 0.3s box-shadow;

    &:hover {
       box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    }
  }

  .details__transaction {
    display: flex;
    justify-content: space-between;
    position: relative;
    min-width: 290px;
    margin-top: -1px;
    padding: 15px 20px;
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 2px;
    box-sizing: border-box;
  }

  .details__row {
    display: flex;
    flex-direction: column;
    width: 33%;
    overflow: hidden;
    box-sizing: border-box;

    &:last-of-type {
       padding-right: 45px;
     }
  }

  .details__remove{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 30px;
    height: 30px;
    top: 15px;
    right: 15px;
    border-radius: 50%;
    border: 1px solid #E0E0E0;
    background-color: #fff;
    cursor: pointer;
    z-index: 1;

    &:hover {
       opacity: 0.7;
     }

    svg {
      fill: #ff5252;
    }
  }

  .details__close {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    border: 1px solid #E0E0E0;
    border-radius: 50%;
  }

</style>
