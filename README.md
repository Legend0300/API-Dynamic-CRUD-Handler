# Dynamic API Handler Web App

This is a React application that fetches data from an API and displays it in a table. It allows you to edit, delete, and create new entities.

## Getting Started

To run the app, follow these steps:

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Start the development server with `npm start`.

## How It Works

The app uses the `useApiData` custom hook to fetch data from the API endpoint specified. The fetched data is then rendered using the `DataRenderer` component.

### `useApiData` Hook

The `useApiData` hook is responsible for fetching data from the API. It takes the API endpoint as an argument and returns the fetched data and loading state. If there's an error during the data fetch, it will be logged to the console.

### `DataRenderer` Component

The `DataRenderer` component receives the API endpoint as a prop and uses the `useApiData` hook to fetch the data. It also handles editing, deleting, and creating entities.

#### Editing Data

When you click the "Edit" button for a particular entity, a popup appears with editable fields for each property of the entity. You can modify the values and click the "Save" button to update the data on the server and in the table.

#### Deleting Data

Clicking the "Delete" button for an entity will remove it from the table and delete it from the server.

#### Creating New Entity

Clicking the "+" button at the bottom-right corner of the page will open a popup with input fields to create a new entity. After filling in the details, click the "Create" button to add the new entity to the table and the server.

## Styling

The app is styled using Tailwind CSS. It uses a responsive table layout and popup modals for editing and creating entities. Buttons have different colors for visual cues, and the "+" button is fixed to the bottom-right corner for easy access.

## Customizing

You can customize the `role` variable in the `DataRenderer` component to control the actions available for different user roles.

Remember to replace the API endpoint in the `App` component with your actual API endpoint.

Feel free to modify the styles in `tailwind.config.js` to match your project's theme.

## Contributors

- [Legend0300](https://github.com/Legend0300)

If you find any issues or want to contribute, please open an issue or submit a pull request on GitHub.

Happy coding!
