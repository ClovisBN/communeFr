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
                    <draggable
                        v-model="form.questions"
                        @end="onDragEnd"
                        itemKey="uniqueId"
                        handle=".cont-drag-composant"
                        :chosen-class="'drag-chosen'"
                        :ghost-class="'drag-ghost'"
                        :animation="200"
                    >
                        <template #item="{ element, index }">
                            <div
                                :key="element.uniqueId"
                                class="cont-form header-form"
                                :class="{
                                    selected:
                                        selectedQuestionIndex ===
                                        element.uniqueId,
                                }"
                                @click="selectQuestion(element.uniqueId)"
                                :ref="`question-${element.uniqueId}`"
                            >
                                <component
                                    :is="element.type"
                                    :question="element"
                                    :index="index"
                                    :class="{
                                        'focus-active':
                                            selectedQuestionIndex ===
                                            element.uniqueId,
                                    }"
                                    @remove="removeQuestion"
                                    @change-type="changeQuestionType"
                                    @change-required="toggleRequired"
                                    @input="saveState"
                                ></component>
                            </div>
                        </template>
                    </draggable>
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
import draggable from "vuedraggable";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion.vue";
import ShortAnswerQuestion from "./ShortAnswerQuestion.vue";
import LongAnswerQuestion from "./LongAnswerQuestion.vue";
import FormHeader from "./FormHeader.vue";

function generateUniqueId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export default {
    components: {
        draggable,
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
                        uniqueId: generateUniqueId(),
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
            selectedQuestionIdBeforeDrag: null, // Ajouté pour stocker l'ID de la question sélectionnée
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
            this.selectedQuestionIndex = this.form.questions[1].uniqueId;
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
                const selectedQuestion = this.form.questions.find(
                    (q) => q.uniqueId === this.selectedQuestionIndex
                );
                newId = selectedQuestion.id + 1;
                insertIndex = this.form.questions.indexOf(selectedQuestion) + 1;
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
                uniqueId: generateUniqueId(),
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
            this.selectedQuestionIndex = question.uniqueId;
            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState(); // Save the state after adding a question

                // Scroll into view if the question exceeds the viewport
                const newQuestionElement =
                    this.$refs[`question-${this.selectedQuestionIndex}`];
                if (newQuestionElement) {
                    newQuestionElement.scrollIntoView({
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
                uniqueId: question.uniqueId,
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
        selectQuestion(uniqueId) {
            this.selectedQuestionIndex = uniqueId;
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
                if (questionElement) {
                    const rect = questionElement.getBoundingClientRect();
                    const scrollTop = this.$refs.scrollContainer.scrollTop;
                    const containerTop =
                        this.$refs.scrollContainer.getBoundingClientRect().top;
                    const containerBottom =
                        this.$refs.scrollContainer.getBoundingClientRect()
                            .bottom;

                    // Calculate the new top position
                    let newTop = rect.top + scrollTop - containerTop;

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
                } else {
                    console.log("Question element not found or invalid.");
                }
            } else {
                console.log("No question selected.");
            }
        },
        onDragEnd(evt) {
            const { oldIndex, newIndex } = evt;
            const movedElement = this.form.questions[newIndex];

            // Réorganiser les IDs après le drag-and-drop
            this.form.questions.forEach((question, index) => {
                question.id = index;
            });

            // Maintenir la sélection sur l'élément déplacé
            this.selectedQuestionIndex = movedElement.uniqueId;

            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState(); // Save the state after selecting a question
            });
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
        },
        undo() {
            if (this.canUndo) {
                this.history.future.push(JSON.stringify(this.form));
                const previousState = this.history.past.pop();
                this.form = JSON.parse(previousState);
            }
        },
        redo() {
            if (this.canRedo) {
                this.history.past.push(JSON.stringify(this.form));
                const nextState = this.history.future.pop();
                this.form = JSON.parse(nextState);
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

<style>
/* Add necessary styles for your main form positioning */
.main-form {
    transition: top 0.3s;
}
</style>
