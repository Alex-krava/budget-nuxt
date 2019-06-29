export const state = () => ({
  budgets: [],
  selectedBudgetId: 0
})

export const mutations = {
  setBudgets(state, budgets) {
    state.budgets = budgets;
  },
  setBudget(state, budget) {
    state.budgets.push(budget);
  },
  setSelectedBudgetId(state, id) {
    state.selectedBudgetId = +id;
  },
  removeBudget(state, index) {
    state.budgets.splice(index, 1);
  },
  resetBudget(state, values) {
    state.budgets[values.index] = values.budget;
  },
  addTransaction(state, values) {
    const budget = _.find(state.budgets, {id: values.id});
    budget.transactions.push(values.transaction);
  },
  removeTransaction(state, values) {
    const budget = _.find(state.budgets, {id: values.id});
    _.remove(budget.transactions, (item, index) => index === values.index);
  },
  updateBudgets(state, values) {
    const budget = _.find(state.budgets, {id: values.id});
    budget.remaining = values.data.remaining;
    budget.averageAmount = values.data.average;
    budget.maximumAmount = values.data.maximum;
    budget.minimumAmount = values.data.minimum;
  }
}

export const actions = {
  fetchBudgets({commit}) {
    try {
      const budgets = localStorage.getItem('budget');
      commit('setBudgets', (budgets) ? JSON.parse(budgets) : [])
    } catch (e) {
      throw e;
    }
  },
  saveBudgets({state, dispatch}) {
    try {
      const data = JSON.stringify(state.budgets);
      localStorage.setItem('budget', data);
      dispatch('fetchBudgets');
    } catch (e) {
      throw e;
    }
  }
}

export const getters = {
  budgets: state => state.budgets,
  selectedBudget: (state) => _.find(state.budgets, {id: state.selectedBudgetId}),
  selectedBudgetId: (state) => state.selectedBudgetId,
}
