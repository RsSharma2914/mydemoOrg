import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class NavigateFromLWC extends NavigationMixin(LightningElement) {
    doNavigateToLWC()
    {
        this[NavigationMixin.Navigate]({
            // Pass in pageReference
            type: 'standard__component',
            attributes: {
              componentName: 'c__navigateToLWC',
            }
          });
    }

}