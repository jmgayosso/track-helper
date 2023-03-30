# Track Helper

Track Helper is a simple command-line tool to generate daily progress reports for your projects using OpenAI's GPT-3 language model. 

## Getting Started

### Prerequisites

To use Track Helper, you will need the following:

* Node.js installed on your machine
* An OpenAI API key

### Installing

1. Clone the repository to your local machine.
2. Run `npm install` to install all the required dependencies.
3. Create a `.env` file in the root of the project and add your OpenAI API key to it in the following format:

    ```
    OPENAI_API_KEY='your_api_key_here'
    ```

You can find your OpenAI API key on the [OpenAI dashboard](https://platform.openai.com/account/api-keys).

## Note on Folder Structure

In order for the `track.sh` script to correctly locate your Git repositories, make sure that your repositories are all located in a single parent directory. For example, you might create a directory called `repos` and place all of your Git repositories inside that directory. The `track.sh` script will search for repositories in the `repos` directory, so make sure that all of your repositories are located there in order for the script to function properly.

If you want to use a different parent directory for your repositories, you can modify the `REPOS_DIR` variable in the `track.sh` script to point to the correct directory path.


## Usage

To use Track Helper, run the following command:
```
npm start
```

Track Helper will generate daily progress reports for all the repositories you have worked on since the last time you ran the command. The progress reports will be saved in a text file in the `logs` directory, and the file will be opened automatically.

## Example of result log.txt

```
===================track-helper====================

🐛 Fix:
- Readme.md: Add quotes around the OpenAI API key in the .env file example

✨ Feature:
- .env.example: Add OPENAI_API_KEY environment variable example

📝 Documentation:
- Readme.md: Add note on folder structure for track.sh script to function properly
- Readme.md: Add instructions for contributing to the project

Chore:
- Remove .env file from gitignore and delete it
- Add logs directory to gitignore
- Delete logs/03-28-2023.txt file
````

## Contributing

Contributions are welcome! To contribute to this project, follow these steps:

1. Fork the repository to your own GitHub account.
2. Clone the repository to your local machine.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them to your branch.
5. Push your changes to your fork on GitHub.
6. Open a pull request from your fork to the `main` branch of the original repository.
7. Wait for feedback and approval from the project maintainers.
