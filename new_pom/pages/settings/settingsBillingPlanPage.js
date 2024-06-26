import SideMenuSettingsComponent from "../../components/sideMenuSettingsComponent";
import SideMenuComponent from "../../components/sideMenuComponent";
import ToastComponent from "../../components/toastComponent";
import { step } from "allure-js-commons";

export default class SettingsBillingPlanPage {

    constructor(page) {
        this.page = page;

        this.sideMenuSettings = new SideMenuSettingsComponent(this.page);
        this.sideMenu = new SideMenuComponent(this.page);
        this.toast = new ToastComponent(this.page);

        this.billingTableColumnHeader = this.page.locator('.billing__table-column--header');
        this.billingHeader = this.page.locator('.billing__trial-header');
        this.selectPersonalPlanButton = this.page.getByText('Select', { exact: true });
    }

    async clickUpgradeButton(plan) {
        await step(`Click "Upgrade" button for ${plan} option`, async () => {
            await this.billingTableColumnHeader
                .filter({ hasText: plan })
                .getByRole('button', { name: "Upgrade" })
                .click();
        });
    }

    async clickSelectPersonalPlanButton() {
        await this.selectPersonalPlanButton.click();
    }

}