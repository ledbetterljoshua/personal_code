# prr-commander

Currently under development.

# What is this thing?

This is a project that I want to create to make life as an IE simpler. In order to create a single tag, one needs to make 10 different edits. I would like be able to do this all through the command line. This project can expand to anything that we can think of. PRR rollups, changing data, anything. If you have any ideas, please feel free to contribute. 

# Install

Clone the repository to your computer, CD into the directory and run

`npm install -g`

This will make the prr command globally accessible within your command line

# Create a Tag

Add tags by using the following command in your terminal. Please ensure you are excecuting the command while inside the correct display code directory

```$ prr createTag "<key>" "<text>" "<externalID>" "<group>" "<category>"```

This will check if your client has both a config folder and a review tag configuration file. If they do not, the folder and file will be created, and a stripped down version of tag configuration XML will be added to the file. The program will then start editing the values and elements to create a tag. 
If the file already exists, the program will read the file, and update it as needed. The same logic applies for the tag properties file (not implemented yet)

This logic is located in the tags.js file. 