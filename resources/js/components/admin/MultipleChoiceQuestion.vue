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
            <draggable
                v-model="question.options"
                handle=".drag-end-drop"
                @end="onOptionDragEnd"
                :chosen-class="'drag-chosen'"
                :ghost-class="'drag-ghost'"
                :animation="200"
                itemKey="id"
            >
                <template #item="{ element, index }">
                    <div class="input-option" :key="element.id">
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
                                    <circle
                                        cy="12.5"
                                        cx="14.5"
                                        r="1.5"
                                    ></circle>
                                    <circle cy="18.5" cx="9.5" r="1.5"></circle>
                                    <circle
                                        cy="18.5"
                                        cx="14.5"
                                        r="1.5"
                                    ></circle>
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
                                v-model="element.text"
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
                </template>
            </draggable>

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
import draggable from "vuedraggable";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique ids

export default {
    components: {
        HeaderTitleForm,
        BottomQuestionForm,
        draggable,
    },
    props: ["question", "index"],
    data() {
        return {
            answer: "",
        };
    },
    created() {
        // Ensure all options are initialized as objects
        this.question.options = this.question.options.map((option) =>
            typeof option === "string" ? { id: uuidv4(), text: option } : option
        );
    },
    methods: {
        addOption() {
            const newOption = {
                id: uuidv4(), // Generate a unique id for each option
                text: `Option ${this.question.options.length + 1}`,
            };
            this.question.options.push(newOption);
            this.$nextTick(() => {
                const newOptionRef = this.$refs[`option${newOption.id}`];
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
        onOptionDragEnd(event) {
            // No need to manually update the array, vuedraggable does it
            console.log("Drag ended:", event.oldIndex, "to", event.newIndex);
        },
    },
};
</script>

<style>
.path {
    height: 16px;
    width: 16px;
    cursor: pointer;
}

.sortable-ghost {
    opacity: 1;
}

.sortable-drag {
    opacity: 0;
}
</style>
