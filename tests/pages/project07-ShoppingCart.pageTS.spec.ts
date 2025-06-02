import { Locator, Page, expect, test } from "@playwright/test"

export default class ShoppingCartPage {
    page: Page
    getCardCourses: Locator
    getTextTotalPrice: Locator
    getHeadingMain: Locator
    getSubHeadingCartItems: Locator
    getItemsOnCart: Locator
    getButtonPlaceOrder: Locator
    getContainerOderConfirmation: Locator
    getButtonCourse0: Locator
    getHeadingCardCourses: Locator
    getImageCardCourses: Locator
    getProviderCardCourses: Locator
    getTextCardCoursesDiscount: Locator
    getButtonCardCoursesAdd: Locator
    getTextCardCoursesFullPrice: Locator

    constructor(page: Page) {
        this.page = page

        // locators 
        this.getHeadingMain = page.locator('.section h1.mt-2')
        this.getCardCourses = page.locator('[id^="course-"]')
        this.getHeadingCardCourses = page.locator('[id^="course-"] h3')
        this.getImageCardCourses = page.locator('[id^="course-"] img')
        this.getProviderCardCourses = page.locator('[id^="course-"] .my-3')
        this.getTextCardCoursesDiscount = page.locator('[id^="course-"] [data-testid="discount"]')
        this.getButtonCardCoursesAdd = page.locator('[id^="course-"] button')
        this.getTextCardCoursesFullPrice = page.locator('[id^="course-"] [data-testid="full-price"]')

        this.getSubHeadingCartItems = page.locator('.mb-2')
        this.getItemsOnCart = page.locator('.course-card')
        this.getTextTotalPrice = page.locator('#total-price')
        this.getButtonPlaceOrder = page.getByRole('button', { name: 'Place Order' })
        this.getContainerOderConfirmation = page.locator('.notification')

        this.getButtonCourse0 = page.locator('#course-1 button')
    }


    // Methods 

    /**
     * @param task is the sting value of the task 
     */
    async addProgramToCart(task: string) {
        await this.getCardCourses.filter({ hasText: task }).getByRole('button', { name: 'Add to Cart' }).click()
    }

}
