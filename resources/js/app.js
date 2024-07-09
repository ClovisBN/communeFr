import { createApp } from "vue";
import router from "./router";

import FormBuilder from "./components/admin/FormBuilder.vue";
import FormList from "./components/admin/FormList.vue";
import MultipleChoiceQuestion from "./components/admin/MultipleChoiceQuestion.vue";
import ShortAnswerQuestion from "./components/admin/ShortAnswerQuestion.vue";
import LongAnswerQuestion from "./components/admin/LongAnswerQuestion.vue";
import SideBar from "./components/admin/SideBar.vue";
import VueDragscroll from "vue-dragscroll";

const app = createApp({});

app.use(router);
app.use(VueDragscroll);

app.component("form-builder", FormBuilder);
app.component("form-list", FormList);
app.component("MultipleChoiceQuestion", MultipleChoiceQuestion);
app.component("ShortAnswerQuestion", ShortAnswerQuestion);
app.component("LongAnswerQuestion", LongAnswerQuestion);
app.component("side-bar", SideBar);

app.mount("#app");
