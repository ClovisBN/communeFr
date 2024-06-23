<template>
    <div class="header-title-form">
        <div class="qerggereqr">
            <input
                class="title-form-head input-hover"
                v-model="question.label"
                :placeholder="placeholder"
            />
            <div class="size-border-input">
                <div class="border-focus-bottom"></div>
                <div class="border-hover-bottom"></div>
            </div>
        </div>
        <div class="change-type-section focus-active">
            <button class="drop-down-change" @click="toggleDropdown">
                {{ title }}
            </button>
            <div v-if="dropdownVisible" class="dropdown">
                <slot name="dropdown-options">
                    <!-- Default Dropdown Options -->
                    <button @click="changeType('ShortAnswerQuestion')">
                        Question Courte
                    </button>
                    <button @click="changeType('LongAnswerQuestion')">
                        Question Longue
                    </button>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        question: Object,
        index: Number,
        title: {
            type: String,
            default: "Question",
        },
        placeholder: {
            type: String,
            default: "Enter your question",
        },
    },
    data() {
        return {
            dropdownVisible: false,
        };
    },
    methods: {
        toggleDropdown() {
            this.dropdownVisible = !this.dropdownVisible;
        },
        changeType(newType) {
            this.$emit("change-type", { index: this.index, newType });
        },
    },
};
</script>
