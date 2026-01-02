import { LightningElement,track} from 'lwc';
export default class HelloWorldLightningWebComponent extends LightningElement {
@track myIp;

    async  getIP() {
       const calloutURI = 'https://api.ipify.org?format=json';
        fetch(calloutURI, {
            method: "GET"
        }).then((response) => response.json())
            .then(repos => {
                console.log(repos)
                this.myIp = repos.ip;
                console.log(this.myIp);
            });
    }
}