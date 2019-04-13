import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import './assets/scss/style.scss'
import makeStore from './store';

import apiService from './shared/api.service';
import Questionnaire from './components/Questionnaire.vue'
import QuestionnaireWidget from './components/QuestionnaireWidget.vue'
Vue.component('questionnaire', Questionnaire);
Vue.component('questionnaire-widget', QuestionnaireWidget);

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    accent: '#1976d2'
  }
});

const store = makeStore( apiService );

/*
for(const selector of ['#qfp-app', '#qfp-list-app']) {
  if(!document.getElementById(selector.slice(1))) continue;
  new Vue({
    el: selector,
    store,
    apiService,
  });
}
*/
if(document.getElementById('qfp-app')) {
    new Vue({
        el: '#qfp-app',
        store,
        apiService,
    });
}