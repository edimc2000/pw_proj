import { Page, expect, test } from "@playwright/test"

export default class ToDoListPage {
    locators: any
    page: any

    constructor(page: Page) {
        this.page = page
        this.locators = {
            getTextPageHeader: page.locator('h1.is-size-3'),
            getTextModalTitle: page.locator('.panel-heading.has-text-white'),
            getButtonAdd: page.locator('#add-btn'),
            getFieldAddToDo: page.locator('#input-add'),
            getFieldSearch: page.locator('#search'),
            getTextMessageContainer: page.locator('.ml-1.has-text-danger'),
            getPanelToDosContainer: page.locator('#panel'),

            getPanelToDosList: page.locator('.panel-block.todo-item div'),
            getPanelToDosListMarker: page.locator('.panel-block.todo-item div span:first-child'),
            getPanelToDosListLastItem: page.locator('div.panel-block div span:last-child').last(),

            getPanelToDoMarkNotDone: page.locator('.panel-icon:nth-child(odd)'),
            getPanelRemoveTaskLastRow: page.locator('.panel-block.todo-item .destroy').last(),

            getPanelToDoDelete: page.locator('.destroy'),
            getRemoveCompleted: page.locator('#clear'),
            getErrorContainer: page.locator('.notification.is-danger')

        }
    }

    /**
     * @param task is the sting value of the task 
     */
    async createTask(task) {
        await this.locators.getFieldAddToDo.clear()
        await this.locators.getFieldAddToDo.fill(task)
        await this.locators.getButtonAdd.click()
    }

    /**
     * @param  task - last task on the list to verify
     */
    async verifyTaskOnList(task: string) {
        expect(await this.locators.getPanelToDosListLastItem).toHaveText(task)
    }
    
    /**
    * @param {number} expectedNumberOfTasks  
    */
    async countTask(expectedNumberOfTasks: number) {
        expect(await this.locators.getPanelToDosListMarker.count()).toBe(expectedNumberOfTasks)
    }

    async markComplete (row: number) {
         await this.locators.getPanelToDosListLastItem.click()
         expect(await this.locators.getPanelToDosListMarker.last()).toHaveClass(/has-text-success/)
    }

    async removeLastRowTask () {
          await this.locators.getPanelRemoveTaskLastRow.click()
     }

     async verifyTaskPanelIsEmpty () {
        expect(await this.locators.getTextMessageContainer).toHaveText('No tasks found!')
     }

}
