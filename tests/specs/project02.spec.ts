import { expect, test } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import ShoppingCartPage from '../pages/project02-ShoppingCart.page'



test.describe('TG Shopping Cart', () => {

    // convert sampleToDoData csv to JS Object
    const csvFile = `${path.join(__dirname, '..', 'data/07-shoppingCartSampleData.csv')}`
    const sampleShoppingCartData = parse(fs.readFileSync(csvFile), {
        columns: true,
        skip_empty_lines: true
    });

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 1440 });
        await page.goto('https://techglobal-training.com/frontend/shopping-cart')
    })

    /*
    [TC01] - Available Courses Section Validation
    * 1. Navigate to https://techglobal-training.com/frontend/shopping-cart
    * 2. Validate the heading is “Available Courses”
    * 3. Validate that there are 3 courses displayed
    * 4. Validate that each course has an image, name, TechGlobal School tag, and a price of more than zero
    * 5. Validate the first 2 courses have discount tags
    * 6. Validate that there is an “Add to Cart” button under each course which is displayed, enabled, and has the text “Add to Cart”
    */
    test('[TC01] - Available Courses Section Validation', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        const countCourses = (await shoppingCartPage.getCardCourses.all()).length

        await test.step(`[Step 2] Validate the heading is “Available Courses”`, async () => {
            //assert heading - task 2 
            expect(await shoppingCartPage.getHeadingMain.innerText()).toContain('Available Courses')
        })

        await test.step(`[Step 3] Validate that there are 3 courses displayed`, async () => {
            // assert card count - task 3
            expect((await shoppingCartPage.getCardCourses.all()).length).toEqual(sampleShoppingCartData.length)
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

    /*
    [TC02] - Cart Section Validation
    * 1. Navigate to https://techglobal-training.com/frontend/shopping-cart
    * 2. Validate the heading is “Items Added to Cart”
    * 3. Validate that the cart is empty by default
    * 4. Validate that the total price is zero “$0” by default
    * 5. Validate that there is a “Place Order” button is displayed, disabled, and has the text “Place Order”
    */

    test('[TC02] - Cart Section Validation', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page)

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


    /*
    [TC03] - Add a Course to the Cart and Validate
    * 1. Navigate to https://techglobal-training.com/frontend/shopping-cart
    * 2. Click on the “Add to Cart” button for one of the courses
    * 3. Validate that the course is displayed in the cart with its image, name, and discount amount if available
    * 4. Validate that the course price is added to the total price ''including'' the discount amount
    * 5. Click on the “Place Order” button
    * 6. Validate a success message is displayed with the text “Your order has been placed.”
    * 7. Validate that the cart is empty
    */

    test('[TC03] - Add a Course to the Cart and Validate', async ({ page }, testInfo) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        const data = sampleShoppingCartData.slice(0, 1)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)
    })

    /* 
   [TC04] - Add Two Courses to the Cart and Validate
   1. Navigate to https://techglobal-training.com/frontend/shopping-cart
   2. Click on the “Add to Cart” button for one of the courses
   3. Click on the “Add to Cart” button for another course
   4. Validate that the courses are displayed in the cart with their image, name, and discount amount if available
   5. Validate that the course prices are added to the total price ''including'' the discount amounts
   6. Click on the “Place Order” button
   7. Validate a success message is displayed with the text “Your order has been placed.”
   8. Validate that the cart is empty
   */


    test('[TC04] - Add Two Courses to the Cart and Validate', async ({ page }, testInfo) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        const data = sampleShoppingCartData.slice(0, 2)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)

    })

    /*
    [TC05] Add All Three Courses to the Cart and Validate
    1. Navigate to https://techglobal-training.com/frontend/shopping-cart
    2. Click on the “Add to Cart” button for all three courses
    3. Validate that the courses are displayed in the cart with their image, name, and discount amount if available
    4. Validate that the course prices are added to the total price 'including' the discount amounts
    5. Click on the “Place Order” button
    6. Validate a success message is displayed with the text “Your order has been placed.”
    7. Validate that the cart is empty
    */


    test('[TC05] Add All Three Courses to the Cart and Validate', async ({ page }, testInfo) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        const data = sampleShoppingCartData.slice(0)
        await shoppingCartPage.addToCartAndValidate(sampleShoppingCartData, data, testInfo.title)

    })



})