                                                        TODOS 

Approach : The application is developed using HTML5, CSS3 and JavaScript. The application can be launched by opening todos.html in browser.  The heart of the application is the java Script object 'TodosList', which is defined inside js/view_handler.js. The application uses 'Local Storage' to keep data. It also uses Cookie as a fallback solution of 'Local Storage'. The data is saved and manipulated in JSON format. 

Design : The application is designed to satisfy all the user stories listed in the coding challenge document. A new todo item can be added either by using the input box in the 'Todos' section, as a quick add or by using the 'Details' section. 
Each app list contains a checkbox in the left, which represents the status of the task (done / not done).  You can mark a task as completed by checking the checkbox. The app supports  1, 2, 3 category of priority tasks, which is marked in the app list. The default priority in quick add is 3. If you want to change the priority or any other details of a task, you can use the ‘Edit’ option.  The todo list also contains a ‘Delete’ button at the right end.  The user can get the high priority tasks at the top of the list by selecting ‘Order by Priority’ option. User can also navigate through lists using ‘Tab’ key.
The footer in the ‘Todos’ section have a notifier, which shows the number of items left.  Footer have a button in the right side, which clears the completed items.

Files : 

	1. todos.html : contains the basic markup of the application. Inside this, an object of "TodosList" is created and initiating the library.

	2. css/base.css : contains the CSS of the application.

	3. js/base.js : contains the utility functions for the application like "$$.find('selector')".

	4. js/localstorage_handler.js : contains the functions to manipulate local storage. The file returns 'LocalStorekeep' object, which contains methords to operate local storage. As a local storage fallback solution, the library uses Cookie.

	5. js/view_handler.js : contains the Object 'TodosList', which handles the todo list items including the list markup creation, event binding, updating local storage using 'LocalStorekeep'.
