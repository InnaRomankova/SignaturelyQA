import { expect } from '@playwright/test';
import { test } from '../fixtures/base.js';
import {
    API_KEY_NAME,
    API_PLANS,
    currentPlan,
    TOAST_MESSAGE,
    QASE_LINK,
    GOOGLE_DOC_LINK,
    TITLE_OF_DOWNGRADE_API_PLAN_MODAL,
} from '../testData.js';
import { description, epic, feature, link, Severity, severity, step, tags } from 'allure-js-commons';
import { userWithGoldAPISubscription } from '../helpers/preconditions.js';

test.describe('API key', () => {
    test('TC_12_48_01 | Verify user can copy API key created by "Create API" button on the right.', async ({
        createBusinessUserAndLogin,
        signPage,
        settingsCompanyPage,
        settingsAPIPage,
        createAPIKeyModal,
    }) => {
        await description('To verify user can copy API key created by "Create API" button on the right.');
        await severity(Severity.BLOCKER);
        await link(`${QASE_LINK}/SIGN-48`, 'Qase: SIGN-48');
        await link(`${GOOGLE_DOC_LINK}l0o8p7o1i4k`, 'ATC_12_48_01');
        await epic('Settings');
        await feature('API');
        await tags('Settings, API key');

        await signPage.sideMenu.clickSettings();
        await settingsCompanyPage.horizontalMenu.clickAPI();

        await settingsAPIPage.clickCreateAPIKeyBtnAtRight();

        await createAPIKeyModal.fillCreateAPIKeyNameField(API_KEY_NAME);
        await createAPIKeyModal.clickCreateAPIBtn();
        await createAPIKeyModal.clickCopyAPIBtn();

        const clipboardApiKeyValue = await createAPIKeyModal.APIKeyValue.innerText();

        await step('Wait toast appears indicating API key has been successfully copied to clipboard.', async () => {
            await settingsAPIPage.toast.toastBody.waitFor();
        });
        await step('Verify toast message API key has been successfully copied to clipboard.', async () => {
            await expect(settingsAPIPage.toast.toastBody).toHaveText(TOAST_MESSAGE.copyApiKey);
        });

        await step('Ensure API key is not empty.', async () => {
            await expect(createAPIKeyModal.getAPIKeyValueText()).not.toBe('');
        });
        await step('Ensure API key is not undefined.', async () => {
            await expect(createAPIKeyModal.getAPIKeyValueText()).not.toBe('undefined');
        });

        await createAPIKeyModal.clickCloseAPIModalBtn();
        await settingsAPIPage.pasteIntoBillingDetailsField(clipboardApiKeyValue);

        const actualBillingDetailsFieldValue = await settingsAPIPage.billingDetailsTextField.innerText();
        if (actualBillingDetailsFieldValue === '') {
            await step('Fill in the "Billing Details" field if shortcuts do not work on Mac', async () => {
                await settingsAPIPage.fillBillingDetailsField(clipboardApiKeyValue);
            });
        }

        await step('Verify pasted API key matches the one created with "Create API" button on the right.', async () => {
            await expect(settingsAPIPage.billingDetailsTextField).toHaveText(clipboardApiKeyValue);
        });
    });

    test('TC_12_48_02 | Verify user can copy API key created by "Create API" button in Table.', async ({
        createBusinessUserAndLogin,
        signPage,
        settingsCompanyPage,
        settingsAPIPage,
        createAPIKeyModal,
    }) => {
        await description('To verify Business user can copy API key created by the "Create API" button in Table.');
        await severity(Severity.BLOCKER);
        await link(`${QASE_LINK}/SIGN-48`, 'Qase: SIGN-48');
        await link(`${GOOGLE_DOC_LINK}4l55n4gzh7rc`, 'ATC_12_48_02');
        await epic('Settings');
        await feature('API');
        await tags('API key');

        await signPage.sideMenu.clickSettings();
        await settingsCompanyPage.horizontalMenu.clickAPI();

        await settingsAPIPage.table.clickCreateAPIKeyBtnInTable();

        await createAPIKeyModal.fillCreateAPIKeyNameField(API_KEY_NAME);
        await createAPIKeyModal.clickCreateAPIBtn();
        await createAPIKeyModal.clickCopyAPIBtn();

        const clipboardApiKeyValue = await createAPIKeyModal.APIKeyValue.innerText();

        await step('Wait toast appears indicating API key has been successfully copied to clipboard.', async () => {
            await settingsAPIPage.toast.toastBody.waitFor();
        });
        await step('Verify toast message API key has been successfully copied to clipboard.', async () => {
            await expect(settingsAPIPage.toast.toastBody).toHaveText(TOAST_MESSAGE.copyApiKey);
        });

        await step('Ensure API key is not empty.', async () => {
            await expect(createAPIKeyModal.getAPIKeyValueText()).not.toBe('');
        });
        await step('Ensure API key is not undefined.', async () => {
            await expect(createAPIKeyModal.getAPIKeyValueText()).not.toBe('undefined');
        });

        await createAPIKeyModal.clickCloseAPIModalBtn();
        await settingsAPIPage.fillBillingDetailsField(clipboardApiKeyValue);

        await step('Verify pasted API key matches the one created with "Create API" button in Table.', async () => {
            await expect(settingsAPIPage.billingDetailsTextField).toHaveText(clipboardApiKeyValue);
        });
    });

    API_PLANS.forEach((apiPlan) => {
        test(`TC_12_49_01 | Verife user can purchase ${apiPlan} API plan.`, async ({
            createBusinessUserAndLogin,
            signPage,
            settingsCompanyPage,
            settingsAPIPage,
            upgradeYourPlanAPIModal,
        }) => {
            await description('To verify Business user can successfully purchase API plan.');
            await severity(Severity.CRITICAL);
            await link(`${QASE_LINK}/SIGN-49`, 'Qase: SIGN-49');
            await link(`${GOOGLE_DOC_LINK}mme3zetebvpb`, 'TC_12_49_01');
            await epic('Settings');
            await feature('API');
            await tags('Subscription');

            await signPage.sideMenu.clickSettings();
            await settingsCompanyPage.horizontalMenu.clickAPI();
            await settingsAPIPage.clickUpgradeButton(apiPlan);
            await upgradeYourPlanAPIModal.clickSubscribeButton();

            await step('Verify toast with "Api plan have been upgraded" appears.', async () => {
                await expect(settingsAPIPage.toast.toastBody).toHaveText(TOAST_MESSAGE.apiPlanUpgraded);
            });
            await step('Verify selected plan is marked as Current plan.', async () => {
                await expect(settingsAPIPage.apiPlansList.filter({ hasText: apiPlan })).toContainText(currentPlan);
            });
        });
    });

    test('TC_12_50_01 | Verify user can Upgrade/Downgrade API subscription.', async ({
        createBusinessUserAndLogin,
        signPage,
        settingsCompanyPage,
        settingsAPIPage,
        upgradeYourPlanAPIModal,
        downGradeYourPlanAPIModal,
    }) => {
        await description('To verify Business user can Upgrade/Downgrade API subscription.');
        await severity(Severity.CRITICAL);
        await link(`${QASE_LINK}/SIGN-50`, 'Qase: SIGN-50');
        await link(`${GOOGLE_DOC_LINK}mjg3zmg3rfxd`, 'TC_12_50_01');
        await epic('Settings');
        await feature('API');
        await tags('Subscription');

        test.setTimeout(60000);
        await userWithGoldAPISubscription(
            createBusinessUserAndLogin,
            signPage,
            settingsCompanyPage,
            settingsAPIPage,
            upgradeYourPlanAPIModal
        );

        await settingsCompanyPage.horizontalMenu.clickAPI();

        for (let i = 1; i < API_PLANS.length; i++) {
            await settingsAPIPage.clickUpgradeButton(API_PLANS[i]);
            await upgradeYourPlanAPIModal.clickSubscribeButton();

            await step('Verify toast with "Api plan have been upgraded" appears.', async () => {
                await expect(settingsAPIPage.toast.toastBody.nth(0)).toHaveText(TOAST_MESSAGE.apiPlanUpgraded);
            });
            await step('Verify selected API plan is marked as Current plan.', async () => {
                await expect(settingsAPIPage.apiPlansList.nth(i)).toContainText(currentPlan);
            });
            await step('Verify current plan is upgraded to higher one.', async () => {
                await expect(settingsAPIPage.apiPlansList.nth(i)).toContainText(API_PLANS[i]);
            });
        }

        for (let i = API_PLANS.length - 2; i >= 0; i--) {
            await settingsAPIPage.clickSelectButton(API_PLANS[i]);

            await step(
                'Verify Title of Downgrade Modal Window has the text "Downgrade to selected Plan".',
                async () => {
                    await expect(downGradeYourPlanAPIModal.titleOfDowngradeModalWindow).toContainText(
                        TITLE_OF_DOWNGRADE_API_PLAN_MODAL[i]
                    );
                }
            );

            await downGradeYourPlanAPIModal.clickDowngradeBtn();

            await step('Verify toast with "Api plan have been upgraded" appears.', async () => {
                await expect(settingsAPIPage.toast.toastBody.nth(0)).toHaveText(TOAST_MESSAGE.apiPlanUpgraded);
            });
        }
    });
});
