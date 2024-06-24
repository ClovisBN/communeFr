<template>
    <div>
        <div class="cont-drag-composant">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff66">
                <circle cy="8.5" cx="11.5" r="1.5"></circle>
                <circle cy="8.5" cx="16.5" r="1.5"></circle>
                <circle cy="14.5" cx="11.5" r="1.5"></circle>
                <circle cy="14.5" cx="16.5" r="1.5"></circle>
                <circle cy="8.5" cx="6.5" r="1.5"></circle>
                <circle cy="14.5" cx="6.5" r="1.5"></circle>
            </svg>
        </div>
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

<style>
.cont-drag-composant {
    display: flex;
    justify-content: center;
    width: 100%;
    cursor: move;
    visibility: hidden;
}
</style>
