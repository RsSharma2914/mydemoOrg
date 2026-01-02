import { LightningElement,api,wire,track } from 'lwc';
import getContacts from '@salesforce/apex/ConatactController.getContacts';
const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];
const columns = [
    { label: "Name", fieldName: "Name" },
    { label: "Title", fieldName: "Title" },
    { label: "Phone", fieldName: "Phone", type: "phone" },
    { label: "Email", fieldName: "Email", type: "email" },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
  ];
export default class accountContact extends LightningElement {
    @api recordId;
    @track data=[];
    @track columns = columns;
    @wire(getContacts, { accountId: "$recordId" })
    wiredAccounts({ error, data }) {
        if (data) {
            console.log(data);
            this.data = data;
        } else if (error) {
            console.log(error);
            this.error = error;
        }
    }
    handleSelected(event){
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'edit':
                this.showRowDetails(row);
                break;
            default:
        }
    }

    deleteRow(row) {
        const { id } = row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }


}