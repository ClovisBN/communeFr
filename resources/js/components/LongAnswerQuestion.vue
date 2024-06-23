<template>
    <div class="oyilyuil">
        <div class="side-color-comp"></div>

        <HeaderTitleForm
            :question="question"
            :index="index"
            title="Question Longue"
            placeholder="Question longue"
            @change-type="changeType"
            @change-required="toggleRequired"
        >
            <template #dropdown-options>
                <button @click="changeType('MultipleChoiceQuestion')">
                    Choix Multiple
                </button>
                <button @click="changeType('ShortAnswerQuestion')">
                    Question Courte
                </button>
            </template>
        </HeaderTitleForm>

        <div class="input-row">
            <div class="DIDeuIfkk">
                <textarea
                    v-model="question.answer"
                    :maxlength="question.maxLength"
                    name="LongAnswerQuestion"
                    @input="autoResize"
                    ref="textarea"
                    autocomplete="off"
                    aria-label="Réponse longue"
                    disabled
                    data-initial-dir="auto"
                    placeholder="Réponse longue"
                ></textarea>
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
textarea {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.2px;
    line-height: 20px;
    color: rgba(251, 251, 251, 0.5);
    flex-grow: 1;
    flex-shrink: 1;
    background-color: transparent;
    border: none;
    display: block;
    height: 23px;
    margin: 0;
    outline: none;
    resize: none;
    z-index: 0;
    overflow-y: hidden; /* Hide the vertical scrollbar */
    overflow-x: hidden;
    position: relative;
    top: 14px;
    padding: 0;
}

.DIDeuIfkk input {
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.2px;
    line-height: 20px;
    color: rgba(251, 251, 251, 0.5);
    flex-grow: 1;
    flex-shrink: 1;
    background-color: transparent;
    height: 23px;
    position: relative;
    top: 14px;
    padding: 0;
}
</style>
