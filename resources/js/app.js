import { createApp } from "vue";
import FormBuilder from "./components/FormBuilder.vue";
import FormList from "./components/FormList.vue";
import MultipleChoiceQuestion from "./components/MultipleChoiceQuestion.vue";
import ShortAnswerQuestion from "./components/ShortAnswerQuestion.vue";
import LongAnswerQuestion from "./components/LongAnswerQuestion.vue";
import SideBar from "./components/SideBar.vue";
import VueDragscroll from "vue-dragscroll";

const app = createApp({});

app.use(VueDragscroll);

app.component("form-builder", FormBuilder);
app.component("form-list", FormList);
app.component("MultipleChoiceQuestion", MultipleChoiceQuestion);
app.component("ShortAnswerQuestion", ShortAnswerQuestion);
app.component("LongAnswerQuestion", LongAnswerQuestion);
app.component("side-bar", SideBar);

app.mount("#app");
