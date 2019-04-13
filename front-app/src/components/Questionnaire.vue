<template>
    <div class="questionnaire">

        <v-app>
            <v-stepper v-model="questionIndex" v-if="questionnaire && questionnaire.question">

                <v-stepper-items>

                    <v-stepper-content :step="index+1"
                                       :key="index"
                                       v-for="(question, index) in questionnaire.question"
                                       class="pl-0 pr-0">
                        <v-card class="ml-0 mr-0 mt-0 pl-4 pr-4 elevation-0 question" color="white lighten-1">

                            <v-toolbar color="blue darken-2" class="mb-4" dark>
                                <v-toolbar-title>{{ question.title }}</v-toolbar-title>
                            </v-toolbar>

                            <v-card-text>
                                <v-radio-group
                                        v-model="answers[index+1].val"
                                        v-if="isQuestionType('single', question.type)"
                                >
                                    <v-radio
                                            v-for="(option, optionIndex) in question.single_choise"
                                            :key="optionIndex"
                                            :label="option.option"
                                            :value="option.option"
                                    ></v-radio>
                                </v-radio-group>

                                <template v-if="isQuestionType('multiple', question.type)">
                                    <div v-for="(option, optionIndex) in question.multiple_choice"
                                         :key="optionIndex">
                                        <v-checkbox
                                                :label="option.option"
                                                v-model="answers[index+1].val[option.option]"
                                                class="mt-0"
                                        ></v-checkbox>
                                    </div>
                                </template>

                                <v-switch
                                        v-if="isQuestionType('boolean', question.type)"
                                        :label="question.question"
                                        v-model="answers[index+1].val"
                                ></v-switch>

                                <template v-if="isQuestionType('scale', question.type)">
                                    <div class="label scale min" v-if="question.scale.scale_min_label">{{ question.scale.scale_min_label }}</div>
                                    <v-slider
                                            v-model="answers[index+1].val"
                                            label=""
                                            :max="question.scale.max"
                                            :min="question.scale.min"
                                            :step="question.scale.step"
                                            :thumb-label="question.scale.scale_visibility ? 'always' : false"
                                            class="mt-5 mr-3 ml-3"
                                    ></v-slider>
                                    <div class="label scale max" v-if="question.scale.scale_max_label">{{ question.scale.scale_max_label }}</div>
                                </template>

                            </v-card-text>

                            <v-btn color="primary" @click="questionIndex++" :disabled="isDisabled" class="ml-0">
                                Continue
                            </v-btn>

                        </v-card>

                    </v-stepper-content>


                    <v-stepper-content
                            :step="questionnaire.question.length+1"
                            class="pl-0 pr-0"
                    >
                        <v-card class="ml-0 mr-0 mt-0 pl-4 pr-4 elevation-0 result" color="white lighten-1" v-if="resultProduct">
                            <v-toolbar color="blue darken-2" class="mb-4" dark>
                                <v-toolbar-title>Result</v-toolbar-title>
                            </v-toolbar>

                            <v-card-text>
                                <p class="text-xs-left" v-html="resultProduct.description"></p>
                            </v-card-text>

                            <v-btn color="primary" @click="finishQuestionnaire" class="ma-0">Restart</v-btn>
                            <!--<v-btn color="success" target="_blank" :href="resultProduct.link" class="mt-0 mr-2" right absolute>Buy now</v-btn>-->
                        </v-card>
                    </v-stepper-content>

                </v-stepper-items>

                <v-stepper-header>
                    <template v-for="(question, index) in questionnaire.question">
                        <v-stepper-step :key="'step' + index"
                                        :editable="!isDisabled || questionIndex > index+1"
                                        :complete="questionIndex > index+1"
                                        :step="index+1"
                        ></v-stepper-step>
                        <v-divider :key="'divider' + index"
                                   v-if="index < questionnaire.question.length-1"
                        ></v-divider>
                    </template>
                </v-stepper-header>

            </v-stepper>
        </v-app>

    </div>
</template>

<script>
    export default {
        name: 'Questionnaire',
        data() {
            return {
                questionIndex: 0,
                answers: {},
                defaultAnswersInitiated: false,
                isDisabled: false,
                filteredProducts: [],
                filteredProductsPreviousStep: [],
                productsCopy: []
            }
        },
        props: {
            id: Number,
            nested: Boolean
        },
        watch: {
            questionnaire(questionnaire) {
                if (questionnaire.question && !this.defaultAnswersInitiated) {
                    this.setDefaultAnswers(questionnaire);
                }
            },
            answers: {
                handler(answers) {
                    this.filterProducts();
                    this.isNextButtonDisabled(this.questionIndex, answers);
                },
                deep: true
            },
            questionIndex(questionIndex) {
                this.filterProducts();
                this.isNextButtonDisabled(questionIndex, this.answers);
            },
            '$store.state.activeQuestionnaireId': function (activeQuestionnaireId) {
                if (activeQuestionnaireId) {
                    this.setDefaultAnswers(this.questionnaire);
                    this.questionIndex = 1;
                }
            },
            'products': function () {
              if(this.$store.state.productsCopy[this.activeProductTypeId]) {
                this.productsCopy = JSON.parse(JSON.stringify(this.$store.state.productsCopy[this.activeProductTypeId]));
              }
            }
        },
        computed: {
            questionnaire() {
                return this.getQuestionnare(this.id);
            },
            resultProduct(){
                return this.filteredProducts.length ? this.filteredProducts[0] : this.filteredProductsPreviousStep[0];
            },
            products() {
              return this.getProducts;
            },
            activeProductTypeId(){
              return this.$store.getters.getActiveProductTypeId;
            }
        },
        methods: {
            isQuestionType(type, checkType) {
                const fieldTypes = {
                    multiple: 'multiple: multiple choice',
                    single: 'single: single choice',
                    boolean: 'boolean: yes/no',
                    scale: 'scale: min and max labels can be configured'
                };
                return fieldTypes[type] === checkType;
            },
            finishQuestionnaire() {
                this.setDefaultAnswers(this.questionnaire);
                this.questionIndex = 1;
            },
            setDefaultAnswers(questionnaire) {
                if (!questionnaire.question) return;
                this.answers = {};
                let step = 1;
                for (const question of questionnaire.question) {
                    const field = question.field.toLowerCase().split(' ').join('_');
                    if (this.isQuestionType('multiple', question.type)) {
                        const options = {};
                        for (const option of question.multiple_choice) {
                            options[option.option] = 0;
                        }
                        this.$set(this.answers, step, {field, val: options, type: 'multiple'})
                    }
                    else if (this.isQuestionType('single', question.type)) {
                        this.$set(this.answers, step, {field, val: '', type: 'single'})
                    }
                    else if (this.isQuestionType('boolean', question.type)) {
                        this.$set(this.answers, step, {field, val: false, type: 'boolean'})
                    }
                    else if (this.isQuestionType('scale', question.type)) {
                        this.$set(this.answers, step, {field, val: question.scale.min, type: 'scale'})
                    }
                    step++;
                }
                this.defaultAnswersInitiated = true;
            },
            isNextButtonDisabled(questionIndex, answers) {
                if(questionIndex === 0) return;

                const questionTrueIndex = questionIndex - 1 >= 0 ? questionIndex - 1 : 0;
                const question = this.questionnaire.question[questionTrueIndex];

                // Enable button if it's not a question
                if (!question) {
                    this.isDisabled = false;
                }
                else if (this.isQuestionType('multiple', question.type) && questionIndex) {
                    let answerQty = 0;
                    for (const answerIndex in answers[questionIndex].val) {
                        answerQty = answers[questionIndex].val[answerIndex] ? answerQty + 1 : answerQty;
                    }
                    this.isDisabled = answerQty ? false : true;
                }
                else if (this.isQuestionType('single', question.type) && !answers[questionIndex].val) {
                    this.isDisabled = true;
                }
                else {
                    this.isDisabled = false;
                }
            },
            productFilter(product) {
              let matchedAnswers = 0;
                for (const step in this.answers) {
                    const parameter = this.answers[step].field;
                    const answerVal = this.answers[step].val;
                    if (step > this.questionIndex) break; // Check only passed answers
                    if (!product.fields[parameter]) return false; // Filter product if id doesn`t have required field

                    if (typeof answerVal === "object" && answerVal !== null) {
                        let checkedAnswers = 0;
                        let checkedResults = 0;
                        for (const option in answerVal) {
                            if (answerVal[option]) {
                                checkedResults = product.fields[parameter].value.includes(option) ? checkedResults+1 : checkedResults;
                                checkedAnswers++;
                            }
                        }
                        const commonResult = checkedAnswers === checkedResults
                        if (commonResult) matchedAnswers++;
                    }
                    else {
                        let simpleResult;
                        if( product.fields[parameter].type === 'number' && this.answers[step].type === 'scale'){
                            simpleResult = true; //product.fields[parameter].value >= answerVal;
                          // if(this.productsCopy[product.id]) {
                          //   const originalProductRank = this.productsCopy[product.id].rank;
                          //   product.rank = originalProductRank - (product.fields[parameter].value * answerVal);
                          // }
                            for(const prod of this.products) {
                              const prodCopy = this.productsCopy.filter((productCopy)=>productCopy.id == prod.id)[0];

                              if (prodCopy) {
                                const originalProductRank = prodCopy.rank;

                                let scaleAnswerAmount = 0;
                                for (const answerId in this.answers) {
                                  const answer = this.answers[answerId];
                                  if (answer.type === 'scale' && prod.fields[answer.field]) {
                                    scaleAnswerAmount += answer.val * prod.fields[answer.field].value;
                                  }
                                }
                                prod.rank = originalProductRank - scaleAnswerAmount;
                              }
                            }

                        }else {
                            if(product.fields[parameter].type === 'multiple') { // case with single option and multiples matches
                              simpleResult = product.fields[parameter].value !== undefined && product.fields[parameter].value.includes(answerVal);
                            }else {
                              simpleResult = product.fields[parameter].value !== undefined && product.fields[parameter].value == answerVal;
                            }
                        }
                        if (simpleResult) matchedAnswers++;
                    }
                }
                const questionIndex = this.questionIndex <= this.getObjectSize(this.answers) ? this.questionIndex : this.questionIndex-1;
                return matchedAnswers === questionIndex
            },
            filterProducts() {
                // Save previous filter results to always have last matching product
                this.filteredProductsPreviousStep = this.filteredProducts.length ? this.filteredProducts : this.filteredProductsPreviousStep;
                this.filteredProductsPreviousStep = this.filteredProductsPreviousStep.length ? this.filteredProductsPreviousStep : this.getProducts;
                this.filteredProducts = this.getProducts.filter(this.productFilter);

                // Sort products by rank in case of rank changed
                this.filteredProducts.sort(this.sortByRank);
                this.filteredProductsPreviousStep.sort(this.sortByRank);
            }
        },
        created: function() {
            this.$parent.$parent.$on('restart', ()=> this.finishQuestionnaire());
        }
    }
</script>
