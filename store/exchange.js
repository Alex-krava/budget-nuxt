import axios from 'axios';

export const state = () => ({
  data: null
});

export const mutations = {
  setData(state, data) {
    state.data = data;
  }
}

export const getters = {
  data: state => state.data
}

export const actions = {
  async fetchExchangeData({commit}, baseRate) {
    try {
      let { data } = await axios.get(`${process.env.exchangeApiResource}?base=${baseRate}`);
      commit('setData', data);
    } catch (e) {
      throw e;
    }
  }
}
