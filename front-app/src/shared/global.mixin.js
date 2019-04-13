import {mapGetters} from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'getQuestionnaries',
            'getQuestionnare',
            'getProducts',
        ])
    },
    beforeCreate() {
        const options = this.$options;
        if (options.apiService)
            this.$apiService = options.apiService;
        else if (options.parent && options.parent.$apiService)
            this.$apiService = options.parent.$apiService;
    },
    methods: {
        getObjectSize(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        },
        sortByRank(a, b) {
            if (+a.rank > +b.rank) return 1;
            if (+a.rank < +b.rank) return -1;
            return 0;
        }
    },
    mounted() {
        if (!this.$store.state.questionnaries.length) {
            this.$store.dispatch('GET_QUESTIONNARIES', this.id);
        }
    }
}