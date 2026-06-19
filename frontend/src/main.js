import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { Button, Cell, CellGroup, Radio, RadioGroup, Field, Tag, Popup, Icon, CountDown, Calendar, Picker, Checkbox, CheckboxGroup, Steps, Step, Rate, NavBar, ImagePreview, Dialog, Image as VanImage } from 'vant';
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
app.use(Checkbox);
app.use(CheckboxGroup);
app.use(Steps);
app.use(Step);
app.use(Rate);
app.use(NavBar);
app.use(ImagePreview);
app.use(Dialog);
app.use(VanImage);

app.mount('#app');
