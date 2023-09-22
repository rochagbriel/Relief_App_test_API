# Node.js User History and Bookmark API

This is a Node.js API for managing user history and bookmarks for videos. The API provides four routes to interact with user data: listing all videos in the history, adding a video to the history, listing all videos in the bookmarks, and adding a video to the bookmarks. No authentication mechanism is implemented in this API.

## Getting Started

### Prerequisites

Before you can run this API, ensure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository to your local machine or download the source code as a ZIP file and extract it.

   ```bash
   git clone https://github.com/your-username/your-api.git
   cd your-api
   ```

2. Install the required dependencies by running the following command in your project directory:

   ```bash
   npm install
   ```

3. Start the API:

   ```bash
   npm start
   ```

   The API will run at `http://localhost:4200` by default.

## API Endpoints

The API provides the following endpoints:

### List all videos in the history

- **URL:** `/history`
- **HTTP Method:** GET
- **Description:** Retrieve a list of all videos in the user's history.

### Add a video to the history

- **URL:** `/history`
- **HTTP Method:** POST
- **Description:** Add a video to the user's history. Provide the video data in the request body.

### List all videos in the bookmarks

- **URL:** `/bookmarks`
- **HTTP Method:** GET
- **Description:** Retrieve a list of all videos in the user's bookmarks.

### Add a video to the bookmarks

- **URL:** `/bookmarks`
- **HTTP Method:** POST
- **Description:** Add a video to the user's bookmarks. Provide the video data in the request body.

## Contributing

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your branch to your fork.
5. Create a pull request to the main repository's `main` branch.

## Credits

Test sent by Relief Applications and coded by Gabriel Rocha.