import { LightningElement,wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/apexcharts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunities from '@salesforce/apex/GEN_ChartController.getOpportunities';
export default class Barchart extends LightningElement {
    chartConfiguration;

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
                chart: {
    type: 'bar'
  },
    series: [{
    name: 'count',
    data: chartAmtData
    }],
     xAxis: {
    categories: chartLabel
      }
    };
    console.log('data => ', data);
    this.error = undefined;
    this.showchart();
    }
    
}

    
    showchart(){
        console.log('json=',this.chartConfiguration);
         // load chartjs from the static resource
         Promise.all([loadScript(this, chartjs)])
        .then(() => {
            console.log('chart log');
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