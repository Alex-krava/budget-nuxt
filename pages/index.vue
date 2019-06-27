<template>
  <section>
    <div class="budgets">
      <ul class="budgets__items">
        <li class="budgets__item budgets__item_create">
          <span class="budgets__link" title="Add Budget" @click="openModal()">+</span>
        </li>
        <li v-for="(budget, index) in budgets" :key="budget.id" class="budgets__item">
          <a @click="openDetail(budget.id)" class="budgets__link">
            <span class="budgets__text">{{budget.name}}</span>
            <span class="budgets__text">Limit: {{budget.limit}}{{budget.currency}}</span>
          </a>
          <a @click="removeBudget(index)" class="budgets__remove">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </a>
          <a @click="resetBudget(index)" class="budgets__reset">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M14 12c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm-2-9c-4.97 0-9 4.03-9 9H0l4 4 4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.51 0-2.91-.49-4.06-1.3l-1.42 1.44C8.04 20.3 9.94 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
            </svg>
          </a>
        </li>
      </ul>
    </div>
    <create-budget v-if="modalFormOpen" v-on:close="closeModal" v-on:create="createBudget($event)"></create-budget>
  </section>
</template>

<script>
    import CreateBudget from '~/components/CreateBudget';

    export default {
      components: {
        CreateBudget
      },
      async fetch({store, error}) {
        try {
          await store.dispatch('budget/fetchBudgets')
        } catch (e) {
          error(e);
        }
      },
      data: () => ({
        modalFormOpen: false,
        validate: false,
        defaultBudget: {
          id: 0,
          name: '',
          currency: (process.env.currencies.length) ? process.env.currencies[0] : '',
          limit: 1000,
          remaining: 1000,
          averageAmount: 0,
          maximumAmount: 0,
          minimumAmount: 0,
          transactions: []
        }
      }),
      computed: {
        budgets() {
          return this.$store.getters['budget/budgets']
        }
      },
      methods: {
        createBudget(value) {
          const budget = JSON.parse(JSON.stringify(this.defaultBudget));
          const lastId = (this.budgets.length) ? this.budgets[this.budgets.length - 1].id : null;
          budget.name = value.name;
          budget.limit = (+value.limit).toFixed(2);
          budget.remaining = (+value.limit).toFixed(2);
          budget.currency = value.currency;
          budget.id = (this.budgets.length) ? lastId + 1 : 1;

          this.$store.commit('budget/setBudget', budget);
          this.$store.dispatch('budget/saveBudgets');
          this.closeModal();
        },
        openModal() {
          this.modalFormOpen = true;
        },
        closeModal() {
          this.modalFormOpen = false;
        },
        removeBudget(index) {
          this.$store.commit('budget/removeBudget', index);
          this.$store.dispatch('budget/saveBudgets');
        },
        resetBudget(index) {
          const budget = JSON.parse(JSON.stringify(this.defaultBudget));
          const budgets = JSON.parse(JSON.stringify(this.budgets));
          budget.id = budgets[index].id;
          budget.name = budgets[index].name;
          this.$store.commit('budget/resetBudget', {index, budget});
          this.$store.dispatch('budget/saveBudgets');
        },
        openDetail(id) {
          this.$router.push(`/${id}`)
        }
      }
    }
</script>

<style lang='scss' scoped>
  @import '~assets/main';
  .budgets {
    padding: 15px;
  }
  .budgets__items {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
  }
  .budgets__item {
    flex: 0 0 145px;
    height: 64px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #E0E0E0;
    border-bottom: none;
    background-color: #fff;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    transition: 0.3s box-shadow;
    position: relative;

    &:hover {
      box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.15);
    }
  }

  .budgets__item_create {
    flex: 0 0 64px;
    height: 64px;
    font-size: 35px;
  }

  .budgets__link {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-decoration: none;
    color: #000;
    cursor: default;
  }

  .budgets__text {
    display: block;
    max-width: 145px;
    padding: 5px;
    overflow: hidden;
    font-size: 0.75em;
    text-overflow: ellipsis;
  }

  .budgets__remove,
  .budgets__reset{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 30px;
    height: 30px;
    top: -15px;
    right: -15px;
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

  .budgets__reset {
    top: auto;
    bottom: -15px;

    svg {
      fill: #000;
    }
  }
</style>

