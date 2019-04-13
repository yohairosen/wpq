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
                                class="ml-1 dropdown"
                                segmented
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
            return {}
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
            }
        },
        filters: {
            button_label(questionnaire) {
                if (!questionnaire) return 'More';
                return questionnaire.button_label ? questionnaire.button_label : questionnaire.title.rendered;
            }
        },
        methods: {
            selectQuestionnaire(id) {
                this.$emit('restart');
                this.$store.dispatch('SET_ACTIVE_QUESTIONNAIRE', id);
            },
            selectQuestionnaireDropdown(selected) {
                this.selectQuestionnaire(selected.value)
            }
        }
    }
</script>