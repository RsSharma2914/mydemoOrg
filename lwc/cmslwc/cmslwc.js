import { LightningElement,api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import html2canvasLib from '@salesforce/resourceUrl/html2canvas';
import jspdf from '@salesforce/resourceUrl/jspdf';
import sendEnvelope from '@salesforce/apex/SendW9FormEnvelopeUsingDocuSign.sendEnvelope';
import getEmbeddedSigningUrl from '@salesforce/apex/SendW9FormEnvelopeUsingDocuSign.getEmbeddedSigningUrl';
import getFileUrl from '@salesforce/apex/SendW9FormEnvelopeUsingDocuSign.getFileUrl';
import { NavigationMixin } from 'lightning/navigation';

export default class Cmslwc extends NavigationMixin(LightningElement) {

  @api btnCloseContentId;
  html2canvasInitialized = false;
  imgsrc = '';
  //static renderMode = "light";
    renderedCallback() {
        if (this.html2canvasInitialized) {
            return;
        }
        this.html2canvasInitialized = true;

        loadScript(this, html2canvasLib)
        .then(() => {
            console.log('html2canvas loaded');
        })
        .catch(error => {
            console.error('Error loading html2canvas:', error);
        });
    }

    takeScreenshot() {
        const target = this.template.querySelector('[data-id="screenshotDiv"]');
        const output = this.template.querySelector('[data-id="outputContainer"]');

        if (!window.html2canvas || !target) {
            console.error('html2canvas not loaded or target not found');
            return;
        }

        html2canvasLib(target).then(canvas => {
            output.innerHTML = ''; // Clear previous
            output.appendChild(canvas);
        });
    }

    generatePdf() {
        try
        {
            this.generatePDFImage();
            const content = this.template.querySelector('[data-id="content"]').innerHTML;
            const { jsPDF } = window.jspdf;
            var verticalOffset=0.5;
            var size=12;
            var margin=0.5;

            const doc = new jsPDF('p', 'in', 'letter');
            //Landscape PDF
            //new jsPDF({   orientation: 'landscape',   unit: 'in',   format: [4, 2] })  
            // jsPDF('p', 'in', 'letter')

            //Sets the text color setTextColor(ch1, ch2, ch3, ch4) 
            doc.setTextColor(100); 
            //Create Text
            doc.text("Hello SalesforceCodex!", 10, 10);
            doc.rect(20, 20, 10, 10);
            
            // Set Margins:
            doc.setDrawColor(0, 255, 0)   //Draw Color
            .setLineWidth(1 / 72)  // Paragraph line width
            .line(margin, margin, margin, 11 - margin) // Margins
            .line(8.5 - margin, margin, 8.5 - margin, 11 - margin)

            var stringText='SalesforceCodex.com is started in 2016 as a personal blog where I tried to solve problems with simple and understandable content. Initially, my focus was on sharing content on which feature I was working. \n\nToday, SalesforceCodex.com is focused on helping salesforce developers, programmers and other IT professionals improve their careers. We are helping developers in integrating other technologies,  coding best practices, lightning web components, architecture, design solutions, etc.';
            
            var lines=doc.setFont('Helvetica', 'Italic')
                                .setFontSize(12)
                                .splitTextToSize(content, 7.5);
            //doc.setFontSize(40);
            doc.text(0.5, verticalOffset + size / 72, lines);
            verticalOffset += (lines.length + 0.5) * size / 72;
            //Save File
            doc.save("a4.pdf");
            
        }
        catch(error) {
            alert("Error " + error);
        }
    }

    openDocusign(){
        //this.openPdfInNewTab();
        let redirectUrl = window.location.href;
        sendEnvelope({ template: '8cc95290-bd54-407f-a7d0-cf6d664f54ed', description: 'Test', recordId: '0012x000006M5FNAA0' })
        .then((envelopeId) => (
            getEmbeddedSigningUrl({
                envId: envelopeId,
                url: redirectUrl
            })
        ))
        .then((signingUrl) => {
            console.log('signingUrl',signingUrl);
            window.location.href = signingUrl;

        })
        .catch((error) => {
            console.log('error',JSON.stringify(error));
        });
    }

    async handleOpenPdf() {
        const url = await getFileUrl({ recordId: '0012x000006M5FNAA0' });
        window.open(url, '_blank');
        // let baseUrl = this.getBaseUrl();
        // let fileUrl =baseUrl+url;
        // this[NavigationMixin.Navigate]({
        //         type: 'standard__webPage',
        //         attributes: {
        //             url: fileUrl
        //         }
        //     }, false );
    }

    openPdfInNewTab() {
        getFileUrl({ recordId: '0012x000006M5FNAA0' })
            .then(base64 => {
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/pdf' });
                const blobURL = URL.createObjectURL(blob);
                window.open(blobURL);
            })
            .catch(error => {
                console.error('Error loading PDF:', error);
            });
    }

    generatePDFImage(e)
    {
        try{
            const { jsPDF } = window.jspdf;
            // You'll need to make your image into a Data URL
            var imgData = 'data:image/jpeg;base64,'+ this.getBase64Image(this.template.querySelector('.image'));            
            var doc = new jsPDF();
            doc.setFontSize(40);
            doc.text(35, 25, 'SalesforceCodex.com');
            doc.addImage(imgData, 'JPEG', 10, 20, 400, 300);
            doc.save("a4.pdf");
        }
        catch(error)
        {
            alert(error);
        }
    }

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    handlePrintClick () {

        let printableElement = this.template.querySelector('.print-section');

         if (printableElement) {

            let clone = printableElement.cloneNode(true);

            let printWindow = window.open('', '_blank');

            if (printWindow) {

                printWindow.document.body.appendChild(clone);

                let style = printWindow.document.createElement('style');

                style.textContent = `

                    @page {

                        size: auto;   /* auto is the initial value */

                        margin: 0mm;  /* this affects the margin in the printer settings */

                    }

                    @media print {

                        body {

                            margin: 50;

                            padding: 0;

                        }

                        .no-print {

                            display: none;

                        }

                    }

                `;

                printWindow.document.head.appendChild(style);

                printWindow.focus();

                printWindow.print();

                printWindow.close();

            } else {

                console.error('Failed to open print window');

            }

        } else {

            console.error('Printable element not found');

        }

    }

    printDiv() {
        
        let targetDiv = this.template.querySelector('[data-id="capture-area"]');
        console.log('@#',targetDiv);
        if (!window.html2canvas || !targetDiv) {
            console.error('html2canvas or target div missing');
            return;
        }

        // window.html2canvas(targetDiv).then(canvas => {
        //     this.imgsrc = canvas.toDataURL();
        //     console.log('@@@',this.imgsrc);
        // }).catch(err => {
        //     console.error('Error capturing screenshot', err);
        // });

        window.html2canvas(targetDiv,{useCORS: true, allowTaint: false}).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            // Create a download link
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'screenshot.png';
            link.click();
        });
    }

    printViaIframe() {
        const html = `
            <html>
                <head>
                    <style>
                        body { font-family: Arial; padding: 20px; }
                        .print-box { border: 1px solid #ccc; padding: 10px; }
                    </style>
                </head>
                <body>
                    <div class="print-box" id="print-section">
                        <h2>Printable Area</h2>
                        <p>This content is inside an iframe.</p>
                        <button>Dummy button</button>
                    </div>
                    <script>
                        window.onload = function () {
                            setTimeout(function () {
                                html2canvas(document.getElementById('print-section')).then(canvas => {
                                    parent.postMessage(canvas.toDataURL(), '*');
                                });
                            }, 500);
                        };
                    </script>
                    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"></script>
                </body>
            </html>
        `;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        document.body.appendChild(iframe);

        // Write to iframe
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        // Listen for the image message
        window.addEventListener('message', (event) => {
            this.imgsrc = event.data;
            document.body.removeChild(iframe);
        }, { once: true });
    }

    getBaseUrl(){
        let baseUrl = 'https://'+location.host+'/';
        return baseUrl;
    }

}