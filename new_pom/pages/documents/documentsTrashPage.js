import TableComponent from "../../components/tableComponent";
import SideMenuDocumentsComponent from "../../components/sideMenuDocumentsComponent";
import SideMenuComponent from "../../components/sideMenuComponent";

export default class DocumentsTrashPage {

    constructor(page) {
        this.page = page;

        this.table = new TableComponent(this.page);
        this.sideMenuDocuments = new SideMenuDocumentsComponent(this.page);
        this.sideMenu = new SideMenuComponent(this.page);
    }

}