<template>
    <div class="cont-create-form-dyn">
        <div ref="header" class="title-form-cont-dynamique">
            <h2 v-if="form.header">{{ form.header.label }}</h2>
            <div class="nav-header-form-right">
                <div class="redo-undo" @click="undo" :disabled="!canUndo">
                    <svg height="24" viewBox="0 0 32 32" width="24">
                        <path
                            fill="#ffffff"
                            d="M20,10H7.8149l3.5874-3.5859L10,5,4,11,10,17l1.4023-1.4146L7.8179,12H20a6,6,0,0,1,0,12H12v2h8a8,8,0,0,0,0-16Z"
                        />
                    </svg>
                </div>
                <div class="redo-undo" @click="redo" :disabled="!canRedo">
                    <svg height="24" viewBox="0 0 32 32" width="24">
                        <path
                            fill="#ffffff"
                            d="M12,10H24.1851L20.5977,6.4141,22,5,28,11,22,17l-1.4023-1.4146L24.1821,12H12a6,6,0,0,0,0,12h8v2H12a8,8,0,0,1,0-16Z"
                        />
                    </svg>
                </div>
                <button class="btn-submit" @click="saveForm">Save Form</button>
            </div>
        </div>
        <div ref="scrollContainer" class="cont-of-cont" @scroll="handleScroll">
            <div class="cont-template" @click.stop>
                <div style="position: relative">
                    <div
                        v-if="form.header"
                        :key="form.header.uniqueId"
                        class="cont-form header-form"
                        :class="{
                            selected:
                                selectedQuestionIndex === form.header.uniqueId,
                        }"
                        @click="selectQuestion(form.header.uniqueId)"
                        ref="formHeader"
                    >
                        <FormHeader
                            :question="form.header"
                            :class="{
                                'focus-active':
                                    selectedQuestionIndex ===
                                    form.header.uniqueId,
                            }"
                            @input="saveState"
                        ></FormHeader>
                    </div>
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
                                    @remove="removeQuestion(index)"
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
            <div class="toll-bar-mobile">
                <div class="cont-btn-toll-bar-mobile">
                    <div class="row-btn-tollbar-mobile">
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

function assignIds(questions) {
    questions.forEach((question, index) => {
        question.id = index;
    });
}

export default {
    name: "FormBuilder",
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
                header: {
                    uniqueId: generateUniqueId(),
                    type: "FormHeader",
                    label: "Formulaire sans Titre",
                    answer: "Ceci est la description du formulaire",
                    required: false,
                },
                questions: [],
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
            selectedQuestionIdBeforeDrag: null,
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
        if (this.form.questions.length === 0) {
            this.addQuestion("MultipleChoiceQuestion");
            this.selectedQuestionIndex =
                this.form.questions[0]?.uniqueId || null;
        } else {
            assignIds(this.form.questions);
        }
        this.$nextTick(() => {
            this.updateMainFormPosition();
        });
        window.addEventListener("resize", this.updateMainFormPosition);
        this.saveState();
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
                    this.selectedQuestionIndex === this.form.header.uniqueId
                        ? this.form.header
                        : this.form.questions.find(
                              (q) => q.uniqueId === this.selectedQuestionIndex
                          );
                newId = selectedQuestion.id + 1;
                insertIndex =
                    this.selectedQuestionIndex === this.form.header.uniqueId
                        ? 0
                        : this.form.questions.indexOf(selectedQuestion) + 1;
            } else {
                newId = this.form.questions.length;
                insertIndex = newId;
            }

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
            assignIds(this.form.questions);
            this.selectedQuestionIndex = question.uniqueId;
            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState();

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
            if (index < 0 || index >= this.form.questions.length) return;

            const removedQuestionId = this.form.questions[index].uniqueId;
            this.form.questions.splice(index, 1);

            for (let i = index; i < this.form.questions.length; i++) {
                this.form.questions[i].id--;
            }

            if (this.form.questions.length > 0) {
                const newIndex = index > 0 ? index - 1 : 0;
                this.selectedQuestionIndex =
                    this.form.questions[newIndex].uniqueId;
            } else {
                this.selectedQuestionIndex = null;
            }

            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState();
            });

            assignIds(this.form.questions);
        },
        changeQuestionType({ index, newType }) {
            if (index < 0 || index >= this.form.questions.length) return;
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
            assignIds(this.form.questions);
            this.updateMainFormPosition();
            this.saveState();
        },
        selectQuestion(uniqueId) {
            this.selectedQuestionIndex = uniqueId;
            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState();
            });
        },
        deselectQuestion() {
            this.selectedQuestionIndex = null;
            this.updateMainFormPosition();
            this.saveState();
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
                    this.selectedQuestionIndex === this.form.header.uniqueId
                        ? this.$refs.formHeader
                        : this.$refs[`question-${this.selectedQuestionIndex}`];
                if (questionElement) {
                    const rect = questionElement.getBoundingClientRect();
                    const scrollTop = this.$refs.scrollContainer.scrollTop;
                    const containerTop =
                        this.$refs.scrollContainer.getBoundingClientRect().top;
                    const containerBottom =
                        this.$refs.scrollContainer.getBoundingClientRect()
                            .bottom;

                    let newTop = rect.top + scrollTop - containerTop;

                    const mainFormHeight = 160;
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
        onDragEnd(evt) {
            const { oldIndex, newIndex } = evt;
            const movedElement = this.form.questions[newIndex];

            this.form.questions.forEach((question, index) => {
                question.id = index;
            });

            this.selectedQuestionIndex = movedElement.uniqueId;

            this.$nextTick(() => {
                this.updateMainFormPosition();
                this.saveState();
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
                    assignIds(this.form.questions);
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
                assignIds(this.form.questions);
            }
        },
        redo() {
            if (this.canRedo) {
                this.history.past.push(JSON.stringify(this.form));
                const nextState = this.history.future.pop();
                this.form = JSON.parse(nextState);
                assignIds(this.form.questions);
            }
        },
        toggleRequired({ index }) {
            if (index === 0) {
                this.form.header.required = !this.form.header.required;
            } else {
                this.form.questions[index - 1].required =
                    !this.form.questions[index - 1].required;
            }
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
