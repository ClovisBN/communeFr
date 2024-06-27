<template>
    <div class="oyilyuil">
        <div class="side-color-comp"></div>
        <div class="header-title-form super-title-form">
            <div class="qerggereqr">
                <input
                    type="text"
                    name="title-form"
                    class="title-form-head input-hover fontSize1"
                    v-model="question.label"
                    placeholder="Formulaire sans Titre"
                    @input="updateForm"
                />
                <div class="size-border-input">
                    <div class="border-focus-bottom"></div>
                    <div class="border-hover-bottom"></div>
                </div>
            </div>
        </div>
        <div class="input-super-header">
            <div class="cont-input-option-border height-input-super">
                <input
                    type="text"
                    class="input-option"
                    name="desc-form"
                    v-model="question.answer"
                    placeholder="Ceci est la description du formulaire"
                    @input="updateForm"
                />
                <div class="border-hover-bottom-input"></div>
                <div class="border-focus-bottom-input"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["question", "index"],
    methods: {
        updateForm() {
            this.$emit("input");
        },
    },
};
</script>
