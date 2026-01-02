import { LightningElement, wire,api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartJS';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunities from '@salesforce/apex/GEN_ChartController.getOpportunities';

 
export default class Gen_opportunitychart extends LightningElement {
    chartConfiguration;
    isChartJsInitialized;
    
    
    @wire(getOpportunities)
    getOpportunities({ error, data }) {
        if (error) {
            this.error = error;
            this.chartConfiguration = undefined;
        } else if (data) {
            let chartAmtData = [];
            
            let chartLabel = [];
            data.forEach(opp => {
                chartAmtData.push(opp.num);
                
                chartLabel.push(opp.stage);
            });
 
            this.chartConfiguration = {
                type: 'bar',
                data: {
                    datasets: [{
                            label: 'Opportunities',
                            backgroundColor: "red",
                            minBarLength: 1,
                            data: chartAmtData,

                        },
                        
                    ],
                    labels: chartLabel,
                },
                options: {},
            };
            console.log('data => ', data);
            this.error = undefined;
            this.showchart();
        }
        
    }

    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }
       
       
    }

    showchart(){
        console.log('json=',this.chartConfiguration);
         // load chartjs from the static resource
    Promise.all([loadScript(this, chartjs)])
        .then(() => {
            this.isChartJsInitialized = true;
           
            const ctx = this.template.querySelector('canvas.barChart').getContext('2d');
            this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfiguration)));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Chart',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    
}
}