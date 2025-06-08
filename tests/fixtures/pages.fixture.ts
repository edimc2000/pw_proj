import { test as base, expect } from '@playwright/test'
import ShoppingCartPage from '../pages/project02-ShoppingCart.page'

import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

// Declare type for fixtures and other variables 

type sampleData = {
    's/n': string
    program: string
    price: number
    provider: string
    discount: number
    image: string
}

type FixtureForPages = {
    shoppingCartPage: ShoppingCartPage
}


// sample test data 
const csvFile: string = `${path.join(__dirname, '..', 'data/07-shoppingCartSampleData.csv')}`
const sampleShoppingCartData: sampleData[] = parse(fs.readFileSync(csvFile), {
    columns: true,
    skip_empty_lines: true
});

// actual fixture to use for test 
const test = base.extend<FixtureForPages>({
    shoppingCartPage: async ({ page }, use) => {
        const shoppingCartPage = new ShoppingCartPage(page)
        await page.goto('https://www.techglobal-training.com/frontend/shopping-cart')
        await use(shoppingCartPage)
    }
})



export { test, expect, sampleShoppingCartData }