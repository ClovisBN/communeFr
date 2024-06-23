<template>
    <div class="bottom-question-form focus1-active">
        <div></div>
        <div class="eqrbdfv">
            <div class="remoove" @click="$emit('remove')">
                <svg height="20px" width="20px" viewBox="0 0 21 22">
                    <path
                        fill="#FBFBFBFB"
                        d="M14,0 L2,0 C0.9,0 0,0.9 0,2 L0,16 L2,16 L2,2 L14,2 L14,0 L14,0 Z M17,4 L6,4 C4.9,4 4,4.9 4,6 L4,20 C4,21.1 4.9,22 6,22 L17,22 C18.1,22 19,21.1 19,20 L19,6 C19,4.9 18.1,4 17,4 L17,4 Z M17,20 L6,20 L6,6 L17,6 L17,20 L17,20 Z"
                    />
                </svg>
            </div>
            <div class="remoove" @click="$emit('remove')">
                <svg height="20px" width="20px" viewBox="0 0 448 512">
                    <path
                        fill="#FBFBFBFB"
                        d="M268 416h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12zM432 80h-82.41l-34-56.7A48 48 0 0 0 274.41 0H173.59a48 48 0 0 0-41.16 23.3L98.41 80H16A16 16 0 0 0 0 96v16a16 16 0 0 0 16 16h16v336a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128h16a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16zM171.84 50.91A6 6 0 0 1 177 48h94a6 6 0 0 1 5.15 2.91L293.61 80H154.39zM368 464H80V128h288zm-212-48h24a12 12 0 0 0 12-12V188a12 12 0 0 0-12-12h-24a12 12 0 0 0-12 12v216a12 12 0 0 0 12 12z"
                    />
                </svg>
            </div>
            <div style="color: #fbfbfbfb; font-size: small; font-weight: 400">
                Obligatory
                <div
                    class="cont-must-question"
                    @click="$emit('change-required')"
                >
                    <div
                        class="background-obligatory"
                        :style="{
                            background: question.required
                                ? 'rgb(111, 113, 232)'
                                : '#b9b9b9',
                        }"
                    ></div>
                    <div
                        class="circle-obligatory"
                        :style="{
                            left: question.required ? '15px' : '0',
                            background: question.required
                                ? 'rgba(53, 56, 218)'
                                : '#FBFBFBFB',
                        }"
                    ></div>
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
    },
};
</script>
