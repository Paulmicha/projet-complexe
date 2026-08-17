/* @refresh reload */
import "./css/index.css";
import { render } from "@solidjs/web";
import App from "./App";

render(() => <App />, document.getElementById("root") as HTMLElement);
