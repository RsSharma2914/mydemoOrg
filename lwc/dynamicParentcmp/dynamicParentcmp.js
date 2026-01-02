import { LightningElement } from 'lwc';
export default class DynamicParentcmp extends LightningElement {

    componentConstructor;
    // Use connectedCallback() on the dynamic component
    // to signal when it's attached to the DOM
    connectedCallback() {
    import("c/dynamicImportChildCmp")
      .then(({ default: ctor }) => (this.componentConstructor = ctor))
      .catch((err) => console.log("Error importing component"));
  }
}