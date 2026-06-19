import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Button, Cell, CellGroup, Radio, RadioGroup, Field, Tag, Popup, Icon, CountDown, Calendar, Picker } from 'vant';
import 'vant/lib/index.css';
import './styles/global.css';

const app = createApp(App);

app.use(router);
app.use(Button);
app.use(Cell);
app.use(CellGroup);
app.use(Radio);
app.use(RadioGroup);
app.use(Field);
app.use(Tag);
app.use(Popup);
app.use(Icon);
app.use(CountDown);
app.use(Calendar);
app.use(Picker);

app.mount('#app');
