<template>
    <div>
        <div class="oyilyuil">
            <div class="side-color-comp"></div>
            <HeaderTitleForm
                :question="question"
                :index="index"
                title="Question Courte"
                placeholder="Question courte"
                @change-type="changeType"
                @change-required="toggleRequired"
            >
                <template #dropdown-options>
                    <button @click="changeType('MultipleChoiceQuestion')">
                        Choix Multiple
                    </button>
                    <button @click="changeType('LongAnswerQuestion')">
                        Question Longue
                    </button>
                </template>
            </HeaderTitleForm>
            <div class="input-row">
                <div class="DIDeuIfkk">
                    <input
                        name="ShortAnswerQuestion"
                        type="text"
                        v-model="question.answer"
                        @input="limitLength"
                        :maxlength="question.maxLength"
                        autocomplete="off"
                        aria-label="Réponse courte"
                        disabled
                        data-initial-dir="auto"
                        placeholder="Réponse courte"
                    />
                    <div class="SPcBRc"></div>
                </div>
                <!-- <div class="conteur-input">
                    {{ answer.length }} / {{ question.maxLength }}
                </div> -->
            </div>

            <BottomQuestionForm
                :question="question"
                :index="index"
                @remove="removeComponent"
                @change-required="toggleRequired"
            />
        </div>
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
        limitLength(event) {
            if (this.answer.length > this.question.maxLength) {
                this.answer = this.answer.slice(0, this.question.maxLength);
            }
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
