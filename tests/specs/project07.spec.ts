import { expect, test } from '@playwright/test'
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import ToDoListPage from '../pages/project01-ToDoList.page.spec';

test.describe('TG Todo List', () => {

    // convert sampleToDoData csv to JS Object
    const csvFile = `${path.join(__dirname, '..', 'data/project01toDoListPageSampleData.csv')}`
    const sampleToDoData = parse(fs.readFileSync(csvFile), {
        columns: true,
        skip_empty_lines: true
    });

    test.beforeEach(async ({ page }) => {
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
        const toDoPage = new ToDoListPage(page)

        await expect(toDoPage.locators.getTextModalTitle).toHaveText('My Tasks')
        await expect(toDoPage.locators.getFieldAddToDo).toBeEnabled()
        await expect(toDoPage.locators.getButtonAdd).toBeEnabled()
        await expect(toDoPage.locators.getFieldSearch).toBeEnabled()
        await expect(toDoPage.locators.getPanelToDosContainer).toBeHidden()
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
        const toDoPage = new ToDoListPage(page)
        let taskArr = sampleToDoData.slice(0, 1) // 1 task coming from the csv file

        await toDoPage.createVerifyAndMark(taskArr)
        await toDoPage.countTask(taskArr.length)
        await toDoPage.removeTaskPerRow(taskArr)
        await toDoPage.verifyTaskPanelIsEmpty()
    })

    /* [TC03] Multiple Task Operations
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Enter and add 5 to-do items individually.
    * 3. Validate that all added items match the items displayed on the list.
    * 4. Mark all the tasks as completed by clicking on them.
    * 5. Click on the “Remove completed tasks!” button to clear them.
    * 6. Validate that the task list is empty, displaying the message “No tasks found!”.
    */
    test('[TC03] Multiple Task Operations', async ({ page }) => {
        const toDoPage = new ToDoListPage(page)
        let taskArr = sampleToDoData.slice(0) // 5 tasks coming from the csv file

        await toDoPage.createVerifyAndMark(taskArr)
        await toDoPage.countTask(taskArr.length)
        await toDoPage.clickRemoveCompletedTask()
        await toDoPage.verifyTaskPanelIsEmpty()
    })

    /* [TC04] Search and Filter Functionality in todo App
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Enter and add 5 to-do items individually.
    * 3. Validate that all added items match the items displayed on the list.
    * 4. Enter the complete name of the previously added to-do item into the search bar.
    * 5. Validate that the list is now filtered to show only the item you searched for.
    * 6. Validate that the number of tasks visible in the list is exactly one.
    */
    test('[TC04] Search and Filter Functionality in todo App', async ({ page }) => {
        const toDoPage = new ToDoListPage(page)
        let taskArr = sampleToDoData.slice(0) // 5 tasks coming from the csv file
        let task = sampleToDoData[0]  // search for this task

        await toDoPage.createVerifyAndMark(taskArr)
        await toDoPage.searchTask(task.toDo)
        await toDoPage.verifyTaskOnList(task.toDo)
        await toDoPage.countTask(1)
    })

    /* [TC05] Task Validation and Error Handling
    * 1. Navigate to https://techglobal-training.com/frontend/todo-list
    * 2. Attempt to add an empty task to the to-do list.
    * 3. Validate that the task list is empty, displaying the message “No task found!”.
    * 4. Enter an item name exceeding 30 characters into the list.
    * 5. Validate error message appears and says “Error: Todo cannot be more than 30 characters!”.
    * 6. Add a valid item name to the list.
    * 7. Validate that the active task count is exactly one.
    * 8. Try to enter an item with the same name already present on the list.
    * 9. Validate that an error message is displayed, indicating “Error: You already have {ITEM} in your todo list.”.
    */
    test('[TC05] Task Validation and Error Handling', async ({ page }) => {
        const toDoPage = new ToDoListPage(page)
        let task = sampleToDoData[0].toDo
        let task30PlusChars = 'this is more than 30 characters..!'

        await toDoPage.createTask('')
        await toDoPage.verifyTaskPanelIsEmpty()

        await toDoPage.createTask(task30PlusChars)
        await toDoPage.verifyErrorMoreThanMaxChars()

        await toDoPage.createTask(task)
        await toDoPage.verifyTaskOnList(task)
        await toDoPage.countTask(1)

        await toDoPage.createTask(task)
        await toDoPage.verifyErrorDuplicate(task)
    })
})