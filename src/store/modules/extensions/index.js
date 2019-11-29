import * as actions from "./actions";
import mutations from "./mutations";

export const initialState = {
  layouts: {},
  interfaces: {},
  modules: {}
};

export default {
  state: _.clone(initialState),
  actions,
  mutations
};
