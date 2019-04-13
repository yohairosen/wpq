/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import globalMixin from './global.mixin'

Vue.use(VueAxios, axios);
const baseUrl = window.location.protocol + "//" + window.location.host;
Vue.axios.defaults.baseURL = `${baseUrl}/wp-json/wp/v2`;

Vue.mixin(globalMixin);

const apiService = {
  updateOptions(options) {
    // To DO
    Object.keys(options).forEach((key) => {
      if (key == 'headers') {
        Object.keys(options[key]).forEach((i) => {
          Vue.axios.defaults.headers[i] = options[key][i];
        })
      }
    });
  },
  get(resource, slug = '') {
    const separator = slug ? '/' : '';
    return Vue.axios
      .get(`${resource}${separator}${slug}`).catch((error) => {
        console.error(error);
      });
  },
  post(resource, data) {
    return Vue.axios
      .post(`${resource}`, data).catch((error) => {
        console.error(error);
      });
  },
  put(resource, data) {
    return Vue.axios
      .put(`${resource}`, data).catch((error) => {
        console.error(error);
      });
  },
  patch(resource, data) {
    return Vue.axios
      .put(`${resource}`, data).catch((error) => {
        console.error(error);
      });
  }
};

export default apiService;