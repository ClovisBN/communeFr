<template>
    <div>
        <h1>List of Forms</h1>
        <ul>
            <li v-for="form in forms" :key="form.id">
                <h2>{{ form.title }}</h2>
                <p>{{ form.description }}</p>
                <pre>{{ JSON.stringify(form.questions, null, 2) }}</pre>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            forms: [],
        };
    },
    created() {
        axios
            .get("/api/forms")
            .then((response) => {
                this.forms = response.data;
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    },
};
</script>
