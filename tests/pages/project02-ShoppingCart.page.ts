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
    getImageItemsOnCart: Locator
    getTextProgramNameItemsOnCart: Locator
    getTextDiscountItemsOnCart: Locator

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
        this.getImageItemsOnCart = page.locator('.course-card img')
        this.getTextProgramNameItemsOnCart = page.locator('.course-card-content .mb-1:first-child')
        this.getTextDiscountItemsOnCart = page.locator('.course-card-content [data-testid="discount"]')

        this.getTextTotalPrice = page.locator('#total-price')
        this.getButtonPlaceOrder = page.getByRole('button', { name: 'Place Order' })
        this.getContainerOderConfirmation = page.locator('.notification')

        this.getButtonCourse0 = page.locator('#course-1 button')
    }


    // Methods 

    /**
     *  @param string is the string value of the task 
    */
    async addProgramToCart(task: string) {
        await this.getCardCourses.filter({ hasText: task }).getByRole('button', { name: 'Add to Cart' }).click()
    }

    async validateCartEmpty() {
        expect(this.getItemsOnCart).not.toBeAttached()
    }

    async validateSuccessMessage() {
        expect(await this.getContainerOderConfirmation.innerText()).toBe('Your order has been placed.')
    }

    async addToCartAndValidate(dataArr: any[], data, title: string): Promise<void> {

        let addingProgram: string
        let validatingCart: string
        let validateTotalPrice: string
        let clickPlaceOrder: string
        let validateSuccessMessage: string
        let validateCartEmpty: string
        const computeTotal: number[] = []

        for (const [index, program] of data.entries()) {
            // test step titles 
            if (title.includes('05') || title.includes('03')) {
                //adding program test step for TC03 and TC05 conditions 
                title.includes('03')
                    ? (
                        addingProgram = '[Step 2] - Click on the “Add to Cart” button for one of the courses',
                        validatingCart = '[Step 3] - Validate that the course is displayed in the cart with its image, name, and discount amount if available'
                    )
                    : (
                        addingProgram = `[Step 2] - Click on the “Add to Cart” button for all three courses ( ${index + 1} )`,
                        validatingCart = `[Step 3](${index + 1}) - Validate that the course is displayed in the cart with its image, name, and discount amount if available`
                    )

                validateTotalPrice = `[Step 4] - Validate that the course price is added to the total price "including" the discount amount`
                clickPlaceOrder = '[Step 5] - Click on the "Place Order" button'
                validateSuccessMessage = '[Step 6] - Validate a success message is displayed with the text “Your order has been placed.”'
                validateCartEmpty = '[Step 7] - Validate that the cart is empty'
            } else {
                addingProgram = `[Step ${index + 2}] - Click on the “Add to Cart” button for course ( ${index + 1} )`
                validatingCart = `[Step 4](${index + 1}) - Validate that the course is displayed in the cart with its image, name, and discount amount if available`
                validateTotalPrice = '[Step 5] - Validate that the course price is added to the total price "including" the discount amount'
                clickPlaceOrder = '[Step 6] - Click on the "Place Order" button'
                validateSuccessMessage = '[Step 7] - Validate a success message is displayed with the text "Your order has been placed."'
                validateCartEmpty = '[Step 8] - Validate that the cart is empty'
            }

            await test.step(`${addingProgram}`, async () => {
                // step 2(X) adding program to cart 
                await this.addProgramToCart(program.program)
            })

            await test.step(`${validatingCart}`, async () => {
                const image = await this.getImageItemsOnCart.nth(index).getAttribute('src')
                const programName = this.getTextProgramNameItemsOnCart.nth(index).innerText()
                const programCost = Number((await this.getTextCardCoursesFullPrice.nth(index).innerText()).slice(1))
                let discount: number | string = 0

                program.discount ? discount = Number((await this.getTextDiscountItemsOnCart.nth(index).innerText()).slice(1, 4).trim()) : discount
                const programCostAfterDiscount = (programCost * (1 - (discount / 100)))
                computeTotal.push(Number(programCostAfterDiscount))

                //step 3(X) validating cart items, image, program name(text), discount amount if available 
                //image validation 
                expect(await image).toBe(program.image)
                //program name 
                expect.soft(await programName).toBe(program.program)
                //cost of item on cart - discount applied 
                expect.soft(programCostAfterDiscount).toEqual(Number(program.price) * (1 - Number(program.discount) / 100))
            })
        }

        await test.step(`${validateTotalPrice}`, async () => {
            //total cost including discount 
            const orderTotal = await this.getTextTotalPrice.innerText()
            expect(orderTotal).toBe('Total: $' + computeTotal.reduce((total, e) => total + e, 0))
        })

        await test.step(`${clickPlaceOrder}`, async () => {
            await this.getButtonPlaceOrder.click()
        })

        await test.step(`${validateSuccessMessage}`, async () => {
            //expect(await this.getContainerOderConfirmation.innerText()).toBe('Your order has been placed.')
            this.validateSuccessMessage()
        })

        await test.step(`${validateCartEmpty}`, async () => {
            this.validateCartEmpty()
        })
    }
}


