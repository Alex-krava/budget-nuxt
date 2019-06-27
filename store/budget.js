export const state = () => ({
  budgets: []
})

export const mutations = {
  setBudgets(state, budgets) {
    state.budgets = budgets;
  },
  setBudget(state, budget) {
    state.budgets.push(budget);
  },
  removeBudget(state, index) {
    state.budgets.splice(index, 1);
  },
  resetBudget(state, values) {
    state.budgets[values.index] = values.budget;
  },
  addTransaction(state, values) {
    state.budgets.some((budgetParam, index) => {
      if (budgetParam.id === values.id) {
        state.budgets[index].transactions.push(values.transaction);
        return true;
      }
      return false;
    });
  },
  removeTransaction(state, values) {
    state.budgets.some((budgetParam, index) => {
      if (budgetParam.id === values.id) {
        state.budgets[index].transactions.splice(values.index, 1);
        return true;
      }
      return false;
    });
  },
  updateBudgets(state, values) {
    state.budgets.some((budgetParam, index) => {
      if (budgetParam.id === values.id) {
        state.budgets[index].remaining = values.data.remaining;
        state.budgets[index].averageAmount = values.data.average;
        state.budgets[index].maximumAmount = values.data.maximum;
        state.budgets[index].minimumAmount = values.data.minimum;
        return true;
      }
      return false;
    });
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
  budgets: state => state.budgets
}
