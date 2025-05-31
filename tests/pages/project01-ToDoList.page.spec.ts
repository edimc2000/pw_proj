import { Locator, Page, expect, test } from "@playwright/test"

export default class ToDoListPage {
    locators: any
    page: Page

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
    // Methods 

    /**
     * @param task is the sting value of the task 
     */
    async createTask(task: string) {
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

    async markComplete() {
        await this.locators.getPanelToDosListLastItem.click()
        expect(await this.locators.getPanelToDosListMarker.last()).toHaveClass(/has-text-success/)
    }

    async removeLastRowTask() {
        await this.locators.getPanelRemoveTaskLastRow.click()
    }

    async verifyTaskPanelIsEmpty() {
        expect(await this.locators.getTextMessageContainer).toHaveText('No tasks found!')
    }
    async verifyErrorDuplicate(task) {
        expect(await this.locators.getErrorContainer).toHaveText(`Error: You already have ${task} in your todo list.`)
    }
    async verifyErrorMoreThanMaxChars() {
        expect(await this.locators.getErrorContainer).toHaveText(`Error: Todo cannot be more than 30 characters!`)
    }

    async createVerifyAndMark(taskArr: string[]) {
        for (const toDo of taskArr) {
            await this.createTask(toDo.toDo)
            await this.verifyTaskOnList(toDo.toDo)
            await this.markComplete()
        }
    }

    async removeTaskPerRow(taskArr: string[]) {
        for (const toDo of taskArr) {
            await this.removeLastRowTask()
        }

    }

    async clickRemoveCompletedTask() {
        await this.locators.getRemoveCompleted.click()

    }

    async searchTask(task: string) {
        await this.locators.getFieldSearch.fill(task)
    }
}
