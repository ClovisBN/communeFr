<template>
    <div>
        <div ref="header" class="title-form-cont-dynamique">
            <h2>{{ form.title }}</h2>
            <div>
                <button class="btn-history" @click="undo" :disabled="!canUndo">
                    Undo
                </button>
                <button class="btn-history" @click="redo" :disabled="!canRedo">
                    Redo
                </button>
                <button class="btn-submit" @click="saveForm">Save Form</button>
            </div>
        </div>
        <div
            ref="scrollContainer"
            class="cont-of-cont"
            @scroll="handleScroll"
            @click="deselectQuestion"
        >
            <div class="cont-template" @click.stop>
                <div style="position: relative">
                    <div
                        v-for="(question, index) in form.questions"
                        :key="question.id"
                        class="cont-form header-form"
                        :class="{ selected: selectedQuestionIndex === index }"
                        @click="selectQuestion(index)"
                        :ref="'question-' + index"
                    >
                        <component
                            :is="question.type"
                            :question="question"
                            :index="index"
                            :class="{
                                'focus-active': selectedQuestionIndex === index,
                            }"
                            @remove="removeQuestion"
                            @change-type="changeQuestionType"
                            @change-required="toggleRequired"
                            @input="saveState"
                        ></component>
                    </div>
                    <div
                        v-if="selectedQuestionIndex !== null"
                        :style="mainFormStyle"
                        class="main-form"
                    >
                        <svg
                            width="25"
                            height="25"
                            style="cursor: pointer"
                            @click="addQuestion('MultipleChoiceQuestion')"
                        >
                            <circle
                                cx="12.5"
                                cy="12.5"
                                r="10.5"
                                stroke="white"
                                stroke-width="2"
                                fill="none"
                            />
                            <line
                                x1="12.5"
                                y1="6"
                                x2="12.5"
                                y2="19"
                                stroke="white"
                                stroke-width="2"
                            />
                            <line
                                x1="6"
                                y1="12.5"
                                x2="19"
                                y2="12.5"
                                stroke="white"
                                stroke-width="2"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion.vue";
import ShortAnswerQuestion from "./ShortAnswerQuestion.vue";
import LongAnswerQuestion from "./LongAnswerQuestion.vue";
import FormHeader from "./FormHeader.vue";

export default {
    components: {
        MultipleChoiceQuestion,
        ShortAnswerQuestion,
        LongAnswerQuestion,
        FormHeader,
    },
    data() {
        return {
            form: {
                questions: [
                    {
                        id: 0,
                        type: "FormHeader",
                        label: "Formulaire sans Titre",
                        answer: "Ceci est la description du formulaire",
                        required: false,
                    },
                ],
            },
            selectedQuestionIndex: null,
            mainFormPosition: {
                top: 0,
                fixed: false,
            },
            history: {
                past: [],
                future: [],
            },
        };
    },
    computed: {
        mainFormStyle() {
            return {
                position: "absolute",
                top: `${this.mainFormPosition.top}px`,
            };
        },
        canUndo() {
            return this.history.past.length > 0;
        },
        canRedo() {
            return this.history.future.length > 0;
        },
    },
    created() {
        this.loadForm();
        if (this.form.questions.length === 1) {
            // Only the header is present
            this.addQuestion("MultipleChoiceQuestion");
            this.selectedQuestionIndex = 1;
            this.$nextTick(() => {
                this.updateMainFormPosition();
            });
        }
        window.addEventListener("resize", this.updateMainFormPosition);
        this.saveState(); // Save the initial state
    },
    mounted() {
        this.$refs.scrollContainer.addEventListener(
            "scroll",
            this.handleScroll
        );
    },
    beforeDestroy() {
        this.$refs.scrollContainer.removeEventListener(
            "scroll",
            this.handleScroll
        );
        window.removeEventListener("resize", this.updateMainFormPosition);
    },
    watch: {
        form: {
            handler(newForm) {
                this.saveFormToLocalStorage();
            },
            deep: true,
        },
    },
    methods: {
        updateForm(newForm) {
            this.form = newForm;
            this.saveState();
        },
        addQuestion(type) {
            let newId;
            let insertIndex;

            if (this.selectedQuestionIndex !== null) {
                const selectedQuestion =
                    this.form.questions[this.selectedQuestionIndex];
                newId = selectedQuestion.id + 1;
                insertIndex = this.selectedQuestionIndex + 1;
            } else {
                // If no question is selected, add to the end
                newId = this.form.questions.length;
                insertIndex = newId;
            }

            // Incrementez les IDs des questions suivantes
            for (let i = insertIndex; i < this.form.questions.length; i++) {
                this.form.questions[i].id++;
            }

            const question = {
                id: newId,
                type: type,
                label: "",
                required: false,
            };

            if (type === "MultipleChoiceQuestion") {
                question.options = ["Option 1", "Option 2", "Option 3"];
            } else if (type === "ShortAnswerQuestion") {
                question.maxLength = 100;
            } else if (type === "LongAnswerQuestion") {
                question.maxLength = 1000;
            }

            this.form.questions.splice(insertIndex, 0, question);
            this.selectedQuestionIndex = insertIndex;
            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState(); // Save the state after adding a question

                // Scroll into view if the question exceeds the viewport
                const newQuestionElement =
                    this.$refs[`question-${this.selectedQuestionIndex}`];
                if (newQuestionElement && newQuestionElement[0]) {
                    newQuestionElement[0].scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                        inline: "nearest",
                    });
                }
            });
        },
        removeQuestion(index) {
            if (index === 0) return; // Prevent removing the FormHeader
            this.form.questions.splice(index, 1);

            // Décrémenter les IDs des questions suivantes
            for (let i = index; i < this.form.questions.length; i++) {
                this.form.questions[i].id--;
            }

            if (this.selectedQuestionIndex === index) {
                this.selectedQuestionIndex = null;
            } else if (this.selectedQuestionIndex > index) {
                this.selectedQuestionIndex -= 1;
            }
            this.updateMainFormPosition();
            this.saveState(); // Save the state after removing a question
        },
        changeQuestionType({ index, newType }) {
            if (index === 0) return; // Prevent changing the type of FormHeader
            const question = this.form.questions[index];
            let newQuestion = {
                id: question.id,
                type: newType,
                label: question.label,
                required: question.required,
            };

            if (newType === "ShortAnswerQuestion") {
                newQuestion.maxLength = 100;
            } else if (newType === "LongAnswerQuestion") {
                newQuestion.maxLength = 1000;
            } else if (newType === "MultipleChoiceQuestion") {
                newQuestion.options = ["Option 1", "Option 2", "Option 3"];
            }

            this.form.questions.splice(index, 1, newQuestion);
            this.updateMainFormPosition();
            this.saveState(); // Save the state after changing the question type
        },
        selectQuestion(index) {
            this.selectedQuestionIndex = index;
            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState(); // Save the state after selecting a question
            });
        },
        deselectQuestion() {
            this.selectedQuestionIndex = null;
            this.updateMainFormPosition();
            this.saveState(); // Save the state after deselecting a question
        },
        handleScroll() {
            const header = this.$refs.header;
            if (header && header.classList) {
                if (this.$refs.scrollContainer.scrollTop > 0) {
                    header.classList.add("shadow");
                } else {
                    header.classList.remove("shadow");
                }
            }

            this.updateMainFormPosition();
        },
        updateMainFormPosition() {
            if (this.selectedQuestionIndex !== null) {
                const questionElement =
                    this.$refs[`question-${this.selectedQuestionIndex}`];
                if (questionElement && questionElement[0]) {
                    const rect = questionElement[0].getBoundingClientRect();
                    const scrollTop = this.$refs.scrollContainer.scrollTop;
                    const containerTop =
                        this.$refs.scrollContainer.getBoundingClientRect().top;
                    const containerBottom =
                        this.$refs.scrollContainer.getBoundingClientRect()
                            .bottom;

                    const currentMainFormTop = this.mainFormPosition.top;

                    // Calculate the new top position
                    let newTop = rect.top + scrollTop - containerTop - 10;

                    // Ensure the main-form stays within the visible window
                    const mainFormHeight = 160; // Adjust according to the actual height of main-form
                    const fixedThresholdTop = 0;
                    const fixedThresholdBottom =
                        containerBottom - mainFormHeight - 20;

                    if (newTop < scrollTop + fixedThresholdTop) {
                        newTop = scrollTop + fixedThresholdTop - 10;
                    } else if (newTop > scrollTop + fixedThresholdBottom) {
                        newTop = scrollTop + fixedThresholdBottom;
                    }

                    this.mainFormPosition.top = newTop;
                }
            }
        },
        saveForm() {
            console.log(this.form);
            axios
                .post("/api/forms", this.form)
                .then((response) => {
                    console.log("Form saved", response.data);
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                });
        },
        saveFormToLocalStorage() {
            localStorage.setItem("form", JSON.stringify(this.form));
        },
        loadForm() {
            const savedForm = localStorage.getItem("form");
            if (savedForm) {
                try {
                    this.form = JSON.parse(savedForm);
                } catch (e) {
                    console.error("Error parsing saved form:", e);
                }
            }
        },
        saveState() {
            this.history.past.push(JSON.stringify(this.form));
            this.history.future = [];
            console.log("State saved:", this.history.past.length);
        },
        undo() {
            if (this.canUndo) {
                this.history.future.push(JSON.stringify(this.form));
                const previousState = this.history.past.pop();
                this.form = JSON.parse(previousState);
                console.log("Undo:", this.form);
            }
        },
        redo() {
            if (this.canRedo) {
                this.history.past.push(JSON.stringify(this.form));
                const nextState = this.history.future.pop();
                this.form = JSON.parse(nextState);
                console.log("Redo:", this.form);
            }
        },
        toggleRequired({ index }) {
            this.form.questions[index].required =
                !this.form.questions[index].required;
            this.saveState();
        },
    },
};
</script>
