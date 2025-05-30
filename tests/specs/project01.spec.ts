import { expect, test } from '@playwright/test'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

import ToDoListPage from '../pages/project01-ToDoList.page.spec'



test.describe('TG Todo List', () => {
    let locators
    let methods

    // covert sampleToDoData csv to JS Object
    const sampleToDoData = parse(fs.readFileSync(path.join(__dirname, '..', 'data/project01toDoListPageSampleData.csv')), {
        columns: true,
        skip_empty_lines: true
    });

    console.log(sampleToDoData)
    console.log(sampleToDoData[0].toDo)


    test.beforeEach(async ({ page }) => {

        methods = new ToDoListPage(page)
        locators = methods.locators
        await page.setViewportSize({ width: 1440, height: 1440 });
        await page.goto('https://www.techglobal-training.com/frontend/todo-list')
    })

    /*
    [TC01] Todo-App Modal Verification
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list.
    * 2. Confirm that the todo-app modal is visible with the title “My Tasks.”
    * 3. Validate that the New todo input field is enabled for text entry.
    * 4. Validate ADD button is enabled.
    * 5. Validate Search field is enabled.
    * 6. Validate that the task list is empty, displaying the message “No tasks found!”
    */
    test('[TC01] Todo-App Modal Verification', async ({ page }) => {
        expect(await locators.getTextModalTitle).toHaveText('My Tasks')
        expect(await locators.getFieldAddToDo).toBeEnabled()
        expect(await locators.getButtonAdd).toBeEnabled()
        expect(await locators.getFieldSearch).toBeEnabled()
        expect(await locators.getPanelToDosContainer).toBeHidden()
        await page.waitForTimeout(100)
    })

    /* 
    [TC02]  Single Task Addition and Removal
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Enter a new task in the todo input field and add it to the list.
    * 3. Validate that the new task appears in the task list.
    * 4. Validate that the number of tasks in the list is exactly one.
    * 5. Mark the task as completed by clicking on it.
    * 6. Validate item is marked as completed.
    * 7. Click on the button to remove the item you have added.
    * 8. Remove the completed task by clicking the designated removal button.
    9. Validate that the task list is empty, displaying the message “No tasks found!”.
    */
    test.only('[TC02] Single Task Addition and Removal', async ({ page }) => {
        let taskArr = sampleToDoData.slice(0,2)

        for (const toDo of taskArr) {
            await methods.createTask(toDo.toDo)
            await methods.verifyTaskOnList(toDo.toDo)

            await methods.markComplete(taskArr.length)
            await methods.countTask(taskArr.length)
            // await methods.removeLastRowTask()
            // await methods.verifyTaskPanelIsEmpty()
        }
        await methods.countTask(taskArr.length)
    })

})