import { test as base } from "@playwright/test";
import SignPage from "../page_objects/signPage";
import { api_user_sign_up } from '../newUserUtils/apiUtilsForNewUser.js';
import { databaseConfirmNewUserEmail } from '../newUserUtils/dbUtilsForNewUser.js';
import { newFreeUserLogin, upgradeFreeUserToBusinessAndLogin } from '../newUserUtils/uiUtilsForNewUser.js';
import NewSignPage from '../new_pom/pages/sign/signPage.js';
import NewDocumentsPage from '../new_pom/pages/documents/documentsPage.js';
import NewDocumentsTrashPage from '../new_pom/pages/documents/documentsTrashPage.js';
import PrepareForSignatureModal from '../new_pom/modalWindows/prepareForSignatureModal.js';
import ActivateTrialStripePage from "../new_pom/pages/activateTrialStripePage";
import NewSettingsCompanyPage from "../new_pom/pages/settings/settingsCompanyPage.js";
import NewSettingsBillingPage from "../new_pom/pages/settings/settingsBillingPage.js";
import NewSettingsBillingPlanPage from "../new_pom/pages/settings/settingsBillingPlanPage.js";
import UpgradeYourPlanModal from "../new_pom/modalWindows/upgradeYourPlanModal";
import SpecialOneTimeOfferModal from "../new_pom/modalWindows/specialOneTimeOfferModal";
import CreateSignatureModal from "../new_pom/modalWindows/createSignatureModal.js";
import FinalStepPage from '../new_pom/pages/finalStepPage.js';
import SuccessModal from '../new_pom/modalWindows/successModal.js';
import EditAndResendDocumentModal from "../new_pom/modalWindows/editAndResendDocumentModal.js";
import DowngradeToPersonalPlanModal from "../new_pom/modalWindows/downgradeToPersonalPlanModal.js"
import NewSettingsAPIPage from "../new_pom/pages/settings/settingsAPIPage";
import NewCreateAPIKeyModal from "../new_pom/modalWindows/createAPIKeyModal.js";
import NewTemplatesPage from "../new_pom/pages/templates/templatesPage.js";
import NewDocumentsAwaitingPage from "../new_pom/pages/documents/documentsAwaitingPage.js";
import SendReminderDocumentModal from "../new_pom/modalWindows/sendReminderDocumentModal.js";

export const test = base.extend({


    createNewFolder: [
        async ({ page }, use) => {
            const signPage = new SignPage(page);

            const documentsPage = await signPage.clickDocumentsSidebarLinkAndGoDocumentsPage();
            await documentsPage.clickCreateFolderBtn();
            await documentsPage.fillNewFolderNameInputField();
            await documentsPage.clickCreateBtn();
            await documentsPage.clickSignSidebarLinkAndGoSignPage();
            await documentsPage.locators.getToast().waitFor({ state: "visible" });
            await documentsPage.locators.getToast().waitFor({ state: "hidden" });

            await use("");
        },
        { scope: "test" },
    ],

    createFreeUserAndLogin: [
        async ({ request, page }, use) => {
            await api_user_sign_up(request);
            await databaseConfirmNewUserEmail();
            await newFreeUserLogin(page);

            await use("");
        },
        { scope: "test" },
    ],

    createBusinessUserAndLogin: [
        async ({ page, createFreeUserAndLogin }, use) => {

            await upgradeFreeUserToBusinessAndLogin(page);

            await use("");
        },
        { scope: "test" },
    ],

    signPage: async ({ page }, use) => {
        await use(new NewSignPage(page));
    },

    prepareForSignatureModal: async ({ page }, use) => {
        await use(new PrepareForSignatureModal(page));
    },

    documentsPage: async ({ page }, use) => {
        await use(new NewDocumentsPage(page));
    },

    documentsAwaitingPage: async ({ page }, use) => {
        await use(new NewDocumentsAwaitingPage(page));
    },

    documentsTrashPage: async ({ page }, use) => {
        await use(new NewDocumentsTrashPage(page));
    },

    activateTrialStripePage: async ({ page }, use) => {
        await use(new ActivateTrialStripePage(page));
    },

    settingsCompanyPage: async ({ page }, use) => {
        await use(new NewSettingsCompanyPage(page));
    },

    settingsBillingPage: async ({ page }, use) => {
        await use(new NewSettingsBillingPage(page));
    },

    settingsBillingPlanPage: async ({ page }, use) => {
        await use(new NewSettingsBillingPlanPage(page));
    },

    upgradeYourPlanModal: async ({ page }, use) => {
        await use(new UpgradeYourPlanModal(page));
    },

    downgradeToPersonalPlanModal: async ({page}, use) => {
        await use(new DowngradeToPersonalPlanModal(page))
    },

    specialOneTimeOfferModal: async ({ page }, use) => {
        await use(new SpecialOneTimeOfferModal(page));
    },


    createSignatureModal: async ({ page }, use) => {
        await use(new CreateSignatureModal(page));
    },

    finalStepPage: async ({ page }, use) => {
        await use(new FinalStepPage(page));
    },

    successModal: async ({ page }, use) => {
        await use(new SuccessModal(page));
    },

    editAndResendDocumentModal: async ({ page }, use) => {
        await use(new EditAndResendDocumentModal(page));
    },

    templatePage: async ({ page }, use) => {
        await use(new NewTemplatesPage(page));
    },

    settingsAPIPage: async ({ page }, use) => {
        await use(new NewSettingsAPIPage(page));
    },

    createAPIKeyModal: async ({ page }, use) => {
        await use(new NewCreateAPIKeyModal(page));
    },

    sendReminderDocumentModal: async ({ page }, use) => {
        await use(new SendReminderDocumentModal(page));
    },
    
});
