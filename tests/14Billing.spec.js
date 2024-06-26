import { expect } from '@playwright/test';
import { test } from "../fixtures/base.js";
import { CARD_DETAILS, RANDOM_ANNUALLY_PLAN, PLANS, END_PLAN } from '../testData.js';
import { description, tags, severity, Severity, link, epic, feature, step } from "allure-js-commons";

test.describe('Billing', () => {

    test('TC_14_57_02 | Verify the ability to successfully downgrade subscription', async ({ createBusinessUserAndLogin, signPage, settingsCompanyPage, settingsBillingPage, settingsBillingPlanPage, downgradeToPersonalPlanModal, specialOneTimeOfferModal }) => {
        await signPage.sideMenu.clickSettings();
        await settingsCompanyPage.sideMenuSettings.clickBilling();
        await settingsBillingPage.clickEditPlanButton();
        await settingsBillingPlanPage.clickSelectPersonalPlanButton();
        await downgradeToPersonalPlanModal.clickDowngradeButton();
        await specialOneTimeOfferModal.clickNoThanksModalBtn();
        await settingsBillingPlanPage.sideMenuSettings.clickBilling();

        await expect(settingsBillingPage.nextInvoiceInfo).toContainText(END_PLAN);
    })

    test.describe('Upsell plan', () => {
        for (const plan of PLANS) {
            test(`TC_14_56_01 | Verify successful upsell of users subscription ${plan} plan`, async ({ createFreeUserAndLogin, signPage, settingsCompanyPage, settingsBillingPage, settingsBillingPlanPage, upgradeYourPlanModal, specialOneTimeOfferModal }) => {
                await signPage.sideMenu.clickSettings();
                await settingsCompanyPage.horizontalMenu.clickBilling();
                await settingsBillingPage.clickUpgradePlanButton();
                await settingsBillingPlanPage.clickUpgradeButton(plan);
                await upgradeYourPlanModal.cardDetails.fillData(CARD_DETAILS.VISA);
                await upgradeYourPlanModal.clickSubscribeButton();
                await specialOneTimeOfferModal.clickYesUpgradeMeBtn();
                await expect(settingsBillingPlanPage.billingHeader).toContainText(RANDOM_ANNUALLY_PLAN(plan));
            })
        }
    })

    test('TC_14_54_01 | Attach/delete payment card', async ({
        createFreeUserAndLogin,
        signPage,
        settingsCompanyPage,
        settingsBillingPage,
    }) => {
        await description('Objective: To verify the functionality of attaching a payment card ' +
            'through the settings-billing section and deleting a payment card through the Billing Portal.')
        await severity(Severity.CRITICAL);
        await link(
            'https://app.qase.io/case/SIGN-54',
            'Qase: SIGN-54'
        );
        await link(
            'https://docs.google.com/document/d/1Qce7tKWOwVYtPxgQv_8ae-HUkbAgeOFph0lB_eziY_k/edit#heading=h.khucr6xuqdib',
            'ATC_14_54_01'
        );
        await epic('Setting');
        await feature('Billing');
        await tags('Payment Card', 'Billing Portal');

        test.setTimeout(100 * 1000);
        await signPage.sideMenu.clickSettings();
        await settingsCompanyPage.horizontalMenu.clickBilling();
        let stripeEnterPaymentDetailsPage = await settingsBillingPage.clickAttachCardButton();
        await stripeEnterPaymentDetailsPage.attachCard(CARD_DETAILS.VISA_DEBIT);
        await settingsBillingPage.reloadPage();

        await step('Verify that the added payment card displayed on the Billing page', async () => {
            await expect(settingsBillingPage.creditCardData).toHaveText(CARD_DETAILS.VISA_DEBIT.displayingOnTheBillingPage);
        });

        stripeEnterPaymentDetailsPage = await settingsBillingPage.clickAttachCardButton();
        await stripeEnterPaymentDetailsPage.attachCard(CARD_DETAILS.MASTERCARD);
        await settingsBillingPage.reloadPage();

        await step('Verify that the added payment card displayed on the Billing page', async () => {
            await expect(settingsBillingPage.creditCardData).toHaveText(CARD_DETAILS.MASTERCARD.displayingOnTheBillingPage);
        });

        let settingBillingPortalPage = await settingsBillingPage.clickOpenBillingPortalButton();

        await step('Verify that the payment card displayed on the Billing Portal page', async () => {
            await expect(settingBillingPortalPage.paymentDefaultMethod).toHaveText(CARD_DETAILS.MASTERCARD.displayingOnTheBillingPortalPage)
        });

        await settingBillingPortalPage.deleteAllNotDefaultCards();

        await step('Verify that there is only one payment card displayed on the Billing Portal page.', async () => {
            await expect(settingBillingPortalPage.paymentMethodsList).toHaveCount(1);
        });
        await step('Verify that there is the last added payment card displayed on the Billing Portal page.', async () => {
            await expect(settingBillingPortalPage.paymentMethodsList).toHaveText(CARD_DETAILS.MASTERCARD.displayingOnTheBillingPortalPage);
        });
    });
})