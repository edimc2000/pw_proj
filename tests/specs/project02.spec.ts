

import { test, expect, sampleShoppingCartData } from '../fixtures/pages.fixture'

test.describe('TG Shopping Cart', () => {
    let countCourses: number
    test('[TC01] - Available Courses Section Validation', async ({ shoppingCartPage }) => {

        await test.step(`[Step 2] Validate the heading is “Available Courses”`, async () => {
            //assert heading - task 2 
            expect(await shoppingCartPage.getHeadingMain.innerText()).toContain('Available Courses')
        })

        await test.step(`[Step 3] Validate that there are 3 courses displayed`, async () => {
            // assert card count - task 3
            countCourses = (await shoppingCartPage.getCardCourses.all()).length
            expect(await shoppingCartPage.getCardCourses.all()).toHaveLength(sampleShoppingCartData.length)
        })

        for (let i = 0; i < countCourses; i++) {
            await test.step(`[Step 3] Card ${i + 1} - Validate that there are 3 courses displayed - visibility`, async () => {
                // assert card visibility - task 3
                expect(shoppingCartPage.getCardCourses.nth(i)).toBeVisible()
            })

            await test.step(`[Step 4] Card ${i + 1} - Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero`, async () => {
                // image - task 4
                expect(await shoppingCartPage.getImageCardCourses.nth(i).getAttribute('src')).toBe(sampleShoppingCartData[i].image)
                //program name - task 4
                expect(await shoppingCartPage.getHeadingCardCourses.nth(i).innerText()).toBe(sampleShoppingCartData[i].program)
                // service provider - task 4
                expect(await shoppingCartPage.getProviderCardCourses.nth(i).innerText()).toBe(sampleShoppingCartData[i].provider)
                // price - task 4
                expect(await shoppingCartPage.getTextCardCoursesFullPrice.nth(i).innerText()).toBe('$' + sampleShoppingCartData[i].price)
            })

            await test.step(`[Step 5] Card ${i + 1} - Validate the first 2 courses have discount tags`, async () => {
                // assert discount on the first 2 cards - task 5
                i < 2 ? expect(await shoppingCartPage.getTextCardCoursesDiscount.nth(i).innerText()).toContain(sampleShoppingCartData[i].discount) : null
            })

            await test.step(`[Step 6] Card ${i + 1} - Validate that there is an “Add to Cart” button under each course which is displayed, enabled, and has the text “Add to Cart”`, async () => {
                // assert button per card visibility, text and clickability - task 6 
                expect(await shoppingCartPage.getButtonCardCoursesAdd.nth(i).innerText()).toBe('Add to Cart')
                expect(shoppingCartPage.getButtonCardCoursesAdd.nth(i)).toBeEnabled
                expect(shoppingCartPage.getButtonCardCoursesAdd.nth(i)).toBeVisible
            })
        }
    })

    test('[TC02] - Cart Section Validation', async ({ shoppingCartPage }) => {
        test.step(`[Step 2] - Validate the heading is “Items Added to Cart”`, async () => {
            expect(await shoppingCartPage.getSubHeadingCartItems.innerText()).toBe('Items Added to Cart')
        })

        test.step(`[Step 3] - Validate that the cart is empty by default`, async () => {
            await expect(shoppingCartPage.getItemsOnCart).not.toBeAttached()
        })

        test.step(`[Step 4] - Validate that the total price is zero “$0” by default`, async () => {
            await expect(shoppingCartPage.getTextTotalPrice).toContainText('$0')
        })

        test.step(`[Step 5] - Validate that there is a “Place Order” button is displayed, disabled, and has the text “Place Order”`, async () => {
            await expect(shoppingCartPage.getButtonPlaceOrder).toHaveText('Place Order')
            await expect(shoppingCartPage.getButtonPlaceOrder).toBeDisabled()
        })

    })

    test('[TC03] - Add a Course to the Cart and Validate', async ({ shoppingCartPage }, testInfo) => {
        const data = sampleShoppingCartData.slice(0, 1)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)
    })

    test('[TC04] - Add Two Courses to the Cart and Validate', async ({ shoppingCartPage }, testInfo) => {
        const data = sampleShoppingCartData.slice(0, 2)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)
    })

    test('[TC05] Add All Three Courses to the Cart and Validate', async ({ shoppingCartPage }, testInfo) => {
        const data = sampleShoppingCartData.slice(0)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)
    })


})
