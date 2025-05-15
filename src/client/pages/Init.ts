import Auth from "./Auth";

export default class Init {
  run(): void {
    new Auth().run();
  }
}