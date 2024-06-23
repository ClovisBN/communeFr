<template>
    <div class="oyilyuil">
        <div class="side-color-comp"></div>
        <div class="header-title-form">
            <div class="qerggereqr">
                <input
                    type="text"
                    name="title-form"
                    class="fontSize1"
                    v-model="question.label"
                    placeholder="Formulaire sans Titre"
                    @input="updateForm"
                />
                <div class="size-border-input">
                    <div class="border-focus-bottom"></div>
                    <div class="border-hover-bottom"></div>
                </div>
            </div>
            <input
                type="text"
                name="desc-form"
                v-model="question.answer"
                placeholder="Ceci est la description du formulaire"
                @input="updateForm"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: ["question", "index"],
    methods: {
        updateForm() {
            this.$emit("update-form", this.question);
        },
    },
};
</script>
