import { expect, test } from '@playwright/test'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import ShoppingCartPage from '../pages/project07-ShoppingCart.page.spec.ts';


test.describe('TG Todo List', () => {

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
    6. Validate that there is an “Add to Cart” button under each course which is displayed, enabled, and has the text “Add to Cart”
    */
    test('[TC01] - Available Courses Section Validation', async ({ page }) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        const countCourses = (await shoppingCartPage.getCardCourses.all()).length

        //assert heading - task 2 
        expect(await shoppingCartPage.getHeadingMain.innerText()).toContain('Available Courses')
        // assert card count - task 3
        expect((await shoppingCartPage.getCardCourses.all()).length).toEqual(sampleShoppingCartData.length)

        for (let i = 0; i < countCourses; i++) {
            // assert card visibility - task 3
            expect(shoppingCartPage.getCardCourses.nth(i)).toBeVisible()

            // image - task 4
            expect(await shoppingCartPage.getImageCardCourses.nth(i).getAttribute('src')).toBe(sampleShoppingCartData[i].image)
            //program name - task 4
            expect(await shoppingCartPage.getHeadingCardCourses.nth(i).innerText()).toBe(sampleShoppingCartData[i].program)
            // service provider - task 4
            expect(await shoppingCartPage.getProviderCardCourses.nth(i).innerText()).toBe(sampleShoppingCartData[i].provider)
            // price - task 4
            expect(await shoppingCartPage.getTextCardCoursesFullPrice.nth(i).innerText()).toBe('$'+sampleShoppingCartData[i].price)

            // assert discount on the first 2 cards - task 5
            i < 2 ? expect(await shoppingCartPage.getTextCardCoursesDiscount.nth(i).innerText()).toContain(sampleShoppingCartData[i].discount) : null

            // assert button per card visibility, text and clickability - task 6 
            expect(await shoppingCartPage.getButtonCardCoursesAdd.nth(i).innerText()).toBe('Add to Cart')
            expect(shoppingCartPage.getButtonCardCoursesAdd.nth(i)).toBeEnabled
            expect(shoppingCartPage.getButtonCardCoursesAdd.nth(i)).toBeVisible
        }

    })

})