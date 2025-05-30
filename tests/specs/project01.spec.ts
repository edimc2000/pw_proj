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
    * 9. Validate that the task list is empty, displaying the message “No tasks found!”.
    */
    test('[TC02] Single Task Addition and Removal', async ({ page }) => {
        let taskArr = sampleToDoData.slice(0,1) // 1 task coming from the csv file

        await methods.createVerifyAndMark(taskArr)
        await methods.countTask(taskArr.length)
        await methods.removeTaskPerRow(taskArr)
        await methods.verifyTaskPanelIsEmpty()
    })


    /* [TC03] Multiple Task Operations
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Enter and add 5 to-do items individually.
    * 3. Validate that all added items match the items displayed on the list.
    * 4. Mark all the tasks as completed by clicking on them.
    * 5. Click on the “Remove completed tasks!” button to clear them.
    * 6. Validate that the task list is empty, displaying the message “No tasks found!”.
    */
    test('[TC03] Multiple Task Operations', async ({ page })  => {
        let taskArr = sampleToDoData.slice(0) // 5 tasks coming from the csv file

        await methods.createVerifyAndMark(taskArr)
        await methods.countTask(taskArr.length)
        await methods.clickRemoveCompletedTask()
        await methods.verifyTaskPanelIsEmpty()
    })


    /* [TC04] Search and Filter Functionality in todo App
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Enter and add 5 to-do items individually.
    * 3. Validate that all added items match the items displayed on the list.
    4. Enter the complete name of the previously added to-do item into the search bar.
    5. Validate that the list is now filtered to show only the item you searched for.
    6. Validate that the number of tasks visible in the list is exactly one.
    */
    test.only('[TC04] Search and Filter Functionality in todo App', async ({ page }) => {
        let taskArr = sampleToDoData.slice(0) // 5 tasks coming from the csv file

        await methods.createVerifyAndMark(taskArr)
    })

})