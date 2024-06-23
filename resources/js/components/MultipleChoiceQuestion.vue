<template>
    <div class="oyilyuil">
        <div class="side-color-comp"></div>

        <HeaderTitleForm
            :question="question"
            :index="index"
            title="Choix multiple"
            placeholder="Choix multiple"
            @change-type="changeType"
            @change-required="toggleRequired"
        >
            <template #dropdown-options>
                <button @click="changeType('ShortAnswerQuestion')">
                    Question Courte
                </button>
                <button @click="changeType('LongAnswerQuestion')">
                    Question Longue
                </button>
            </template>
        </HeaderTitleForm>

        <div class="input-column">
            <div
                class="input-option"
                v-for="(option, index) in question.options"
                :key="index"
            >
                <div class="cont-drag-end-drop">
                    <div class="drag-end-drop">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="#ffffff66"
                        >
                            <circle cy="6.5" cx="9.5" r="1.5"></circle>
                            <circle cy="6.5" cx="14.5" r="1.5"></circle>
                            <circle cy="12.5" cx="9.5" r="1.5"></circle>
                            <circle cy="12.5" cx="14.5" r="1.5"></circle>
                            <circle cy="18.5" cx="9.5" r="1.5"></circle>
                            <circle cy="18.5" cx="14.5" r="1.5"></circle>
                        </svg>
                    </div>
                </div>
                <div class="cont-encoche-option">
                    <div class="margin-option-encoche">
                        <div class="circle-encoche"></div>
                    </div>
                </div>
                <div class="cont-input-option-border">
                    <input
                        class="input-option"
                        name="MultipleChoiceQuestion"
                        v-model="question.options[index]"
                        :ref="'option' + index"
                        @focus="$event.target.select()"
                    />

                    <div class="border-hover-bottom-input"></div>
                    <div class="border-focus-bottom-input"></div>
                </div>
                <div class="cont-cross-delet-option">
                    <svg
                        @click="removeOption(index)"
                        class="focus-active"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#5f6368"
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        ></path>
                        <path d="M0 0h24v24H0z" fill="none"></path>
                    </svg>
                </div>
            </div>

            <div class="input-option focus1-active">
                <div class="margin-add-option"></div>
                <div class="cont-encoche-option">
                    <div class="margin-option-encoche">
                        <div class="circle-encoche"></div>
                    </div>
                </div>
                <div class="cont-input-option-border">
                    <div class="add-option" @click="addOption">Add Option</div>
                </div>
            </div>
        </div>

        <BottomQuestionForm
            :question="question"
            :index="index"
            @remove="removeComponent"
            @change-required="toggleRequired"
        />
    </div>
</template>

<script>
import HeaderTitleForm from "./HeaderTitleForm.vue";
import BottomQuestionForm from "./BottomQuestionForm.vue";

export default {
    components: {
        HeaderTitleForm,
        BottomQuestionForm,
    },
    props: ["question", "index"],
    data() {
        return {
            answer: "",
        };
    },
    methods: {
        addOption() {
            const newOptionNumber = this.question.options.length + 1;
            const newOption = `Option ${newOptionNumber}`;
            this.question.options.push(newOption);
            this.$nextTick(() => {
                const newOptionRef = this.$refs[`option${newOptionNumber - 1}`];
                if (newOptionRef && newOptionRef[0]) {
                    newOptionRef[0].focus();
                    newOptionRef[0].select();
                }
            });
        },
        removeOption(index) {
            this.question.options.splice(index, 1);
        },
        removeComponent() {
            this.$emit("remove", this.index);
        },
        changeType(newType) {
            this.$emit("change-type", { index: this.index, newType });
        },

        toggleRequired() {
            this.$emit("change-required", { index: this.index });
        },
    },
};
</script>

<style>
path {
    height: 16px;
    width: 16px;
    cursor: pointer;
}
</style>
