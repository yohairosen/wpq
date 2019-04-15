<template>
    <v-app>
        <div class="questionnaireWidget">
            <v-toolbar>
                <template v-for="(questionnaire, index) of questionnairies">
                    <v-btn color="primary" dark
                           @click="selectQuestionnaire(questionnaire.id)"
                           :key="index"
                           v-if="index < buttonsNumber"
                           class="ml-1 elevation-0"
                           :class="{ 'active-questionnaire': questionnaire.id == $store.state.activeQuestionnaireId }"
                    >{{ questionnaire | button_label }}
                    </v-btn>
                </template>

                <v-overflow-btn dark
                                label="More"
                                :items="dropdownQuestionnairies"
                                v-if="questionnairies.length > buttonsNumber"
                                item-text="text"
                                item-value="value"
                                return-object
                                @change="selectQuestionnaireDropdown"
                                class="ml-1 dropdown desktop-only"
                                v-model="selectedQuestionnaire"
                ></v-overflow-btn>

                <v-overflow-btn dark
                                label="More"
                                :items="dropdownQuestionnairiesAll"
                                item-text="text"
                                item-value="value"
                                return-object
                                @change="selectQuestionnaireDropdown"
                                class="ml-1 dropdown mobile-only"
                                v-model="selectedQuestionnaire"
                ></v-overflow-btn>

            </v-toolbar>

            <questionnaire :id='$store.state.activeQuestionnaireId' :nested="true"></questionnaire>
        </div>
    </v-app>
</template>

<script>

    export default {
        name: 'QuestionnaireWidget',
        data() {
            return {
              selectedQuestionnaire: {text: 'More', value: ''}
            }
        },
        computed: {
            questionnairies() {
                return this.getQuestionnaries
            },
            buttonsNumber() {
                return this.questionnairies && this.questionnairies[0] ? this.questionnairies[0]['buttons_number'] : 0;
            },
            activeQuestionnaire() {
                return this.getQuestionnare(this.$store.activeQuestionnaireId)
            },
            dropdownQuestionnairies() {
                return this.questionnairies.slice(this.buttonsNumber)
                    .map((element) => {
                        return {
                            text: this.$options.filters.button_label(element),
                            value: element.id,
                            callback: () => this.selectQuestionnaireDropdown({value: element.id})
                        }
                    });
            },
            dropdownQuestionnairiesAll() {
                return this.questionnairies
                    .map((element) => {
                        return {
                            text: this.$options.filters.button_label(element),
                            value: element.id,
                            callback: () => this.selectQuestionnaireDropdown({value: element.id})
                        }
                    });
            },
        },
        filters: {
            button_label(questionnaire) {
                if (!questionnaire) return 'More';
                return questionnaire.button_label ? questionnaire.button_label : questionnaire.title.rendered;
            }
        },
        methods: {
            selectQuestionnaire(id, resetSelect = true) {
                this.$emit('restart');
                this.$store.dispatch('SET_ACTIVE_QUESTIONNAIRE', id);

                if(resetSelect) {
                  this.selectedQuestionnaire = {text: 'More', value: ''}
                }
            },
            selectQuestionnaireDropdown(selected) {
                this.selectQuestionnaire(selected.value, false)
            }
        }
    }
</script>