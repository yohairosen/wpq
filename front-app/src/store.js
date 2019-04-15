import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


const state = {
    loading: true,
    questionnaries: [],
    products: [],
    productsCopy: [],
    activeQuestionnaireId: null,
    activeProductTypeId: null,
    questionnariesRequested: false,
    productsRequested: false,
};

function makeActions(apiService) {
    return {
        GET_QUESTIONNARIES({commit, state, dispatch}) {
            if (state.questionnariesRequested) return; // Request questionnaries only once

            commit('SET_QUESTIONNAIRES_REQUESTED', true);
            commit('SET_LOADING', true);
            apiService.get(`/questionnairies`).then((res) => {
                commit('SET_QUESTIONNARIES', res.data);
                if (res.data && res.data[0]) {
                    dispatch('SET_ACTIVE_QUESTIONNAIRE', res.data[0].id);
                }
                dispatch('GET_PRODUCTS');
                commit('SET_QUESTIONNAIRES_REQUESTED', false);
                commit('SET_LOADING', false)
            });
        },
        GET_QUESTIONNAIRE({commit}, id) {
            commit('SET_LOADING', true);
            apiService.get(`/questionnairies/${id}`).then((res) => {
                commit('SET_QUESTIONNAIRE', res.data);
                commit('SET_LOADING', false)
            });
        },
        GET_PRODUCTS({commit}) {
            if (state.productsRequested) return; // Request products only once

            commit('SET_PRODUCTS_REQUESTED', true);
            commit('SET_LOADING', true);
            apiService.get(`/finproducts`).then((res) => {
                if (res.data) {
                    commit('SET_PRODUCTS', res.data);
                }
                commit('SET_PRODUCTS_REQUESTED', false);
                commit('SET_LOADING', false)
            });
        },
        SET_ACTIVE_QUESTIONNAIRE({commit, state}, id) {
            commit('SET_ACTIVE_QUESTIONNAIRE', id);
            for (const questionnaire of state.questionnaries){
                if (questionnaire.id === id && questionnaire.products_type) {
                    commit('SET_ACTIVE_PRODUCT_TYPE', questionnaire.products_type);
                }
            }
        },
        SET_ACTIVE_PRODUCT_TYPE({commit}, id) {
            commit('SET_ACTIVE_PRODUCT_TYPE', id);
        }
    };
}

const mutations = {
    SET_LOADING(state, payload) {
        state.loading = payload;
    },
    SET_QUESTIONNARIES(state, payload) {
        // Sort questionnaires by order
        payload.sort((a, b) => {
            if (+a.order > +b.order) return 1;
            if (+a.order < +b.order) return -1;
            return 0;
        });
        state.questionnaries = payload;
    },
    SET_QUESTIONNAIRE(state, payload) {
        state.questionnaries.push(payload)
    },
    SET_PRODUCTS(state, payload) {

        state.products = {};
        state.productsCopy = {};

        for (const productType of payload) {
            const products = [];
            if(productType.product === undefined) continue;
            for (const productId in productType.product) {
                const product = productType.product[productId];
                const formatedProduct = {
                    id: productId,
                    rank: product.rank,
                    description: product.description,
                };
                formatedProduct.fields = {};
                for (const fieldName in product) {
                    if(formatedProduct[fieldName] !== undefined) continue;
                    const fieldValue = product[fieldName];

                    let fieldType;
                    switch (typeof fieldValue) {
                        case 'object':
                            fieldType = 'multiple';
                            break;
                        case 'boolean':
                            fieldType = 'boolean';
                            break;
                        case 'string':
                            fieldType = parseInt(fieldValue) ? 'number' : 'single';
                            break;
                    }
                    formatedProduct.fields[fieldName] = {
                        type: fieldType,
                        value: fieldValue
                    };
                    if (fieldType === 'multiple') {
                        const multiValue = [];
                        for (const value of formatedProduct.fields[fieldName].value) {
                            multiValue.push(value);
                        }
                        formatedProduct.fields[fieldName].value = multiValue;
                    }
                }
                products.push(formatedProduct);
            }

            // Sort products by rank
            products.sort((a, b) => {
                if (+a.rank > +b.rank) return 1;
                if (+a.rank < +b.rank) return -1;
                return 0;
            });
            state.products[productType.id] = products;
            state.productsCopy[productType.id] = JSON.parse(JSON.stringify(products));
        }
    },
    SET_ACTIVE_QUESTIONNAIRE(state, payload) {
        state.activeQuestionnaireId = payload;
    },
    SET_ACTIVE_PRODUCT_TYPE(state, payload) {
        state.activeProductTypeId = payload;
    },
    SET_QUESTIONNAIRES_REQUESTED(state, payload) {
        state.questionnariesRequested = payload;
    },
    SET_PRODUCTS_REQUESTED(state, payload) {
        state.productsRequested = payload;
    }
};

const getters = {
    loading: (state) => state.loading,

    getQuestionnaries: (state) => state.questionnaries.filter(questionnaire => questionnaire.show_on_home_page),

    getQuestionnare: (state) => (id) => state.questionnaries.find(questionnaire => +questionnaire.id === +id),

    getProducts: (state) => state.activeProductTypeId && state.products[state.activeProductTypeId] ? state.products[state.activeProductTypeId] : [],

    getActiveQuestionnaire: (state) => state.activeQuestionnaireId,

    getActiveProductTypeId: (state) => state.activeProductTypeId
};

export default function makeStore(apiService) {
    return new Vuex.Store({
        state,
        actions: makeActions(apiService),
        mutations,
        getters
    });
}
