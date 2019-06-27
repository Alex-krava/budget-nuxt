export default function ({store, redirect, params}) {
  try {
    store.dispatch('budget/fetchBudgets')
  } catch (e) {
    error(e);
  }
  const budgets = store.getters['budget/budgets'];
  const hasBudget = budgets.some((budget) => budget.id === +params.id);
  if (!hasBudget) {
    redirect('/');
  }
}
