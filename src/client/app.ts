import "../../client/scss/app.scss";
import Init from "./pages/Init";

window.onload = () => {
  const init: Init = new Init();
  init.run();
}