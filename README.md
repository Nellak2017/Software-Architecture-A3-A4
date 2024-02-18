# Table of Contents

- [Summary](#summary)
- [The KWIC system](#the-kwic-system)
  * [Functional Requirements](#functional-requirements)
  * [Non-Functional Requirements](#non-functional-requirements)
- [The Deliverable](#the-deliverable)
  * [Deployment](#deployment)
  * [Typical interactions](#typical-interactions)
- [User Guide](#user-guide)
  * [Computing KWIC Index and viewing the results](#computing-kwic-index-and-viewing-the-results)
  * [Clearing the Input/Output](#clearing-the-input-output)
- [Setting up the Key Word In Context System to Run Locally](#setting-up-the-key-word-in-context-system-to-run-locally)

# Summary

The Key Word In Context (KWIC) system is designed to generate an index of all circular shifts of input lines, sorted in ascending alphabetical order. Developed as part of a larger web search engine project, the KWIC system accepts ordered sets of lines, where each line consists of words which are just a series of characters.

# The KWIC system

## Functional Requirements

•	Accept an ordered set of lines as input.

•	Circularly shift each line by repeatedly removing the first word and appending it at the end of the line.

•	Output a list of all circular shifts of all lines in ascending alphabetical order.

## Non-Functional Requirements

•	Understandable, portable, scalable, and reusable

•	User-friendly, responsive, and adaptive

# The Deliverable

The KWIC system consists of a user interface where users can input lines of text, compute the KWIC index, and view the results.

## Deployment

•	The KWIC system can be accessed through a web browser.

•	Some local setup is required since I will not host this toy project.

## Typical interactions

1.	Input: Users enter lines of text into the provided text area.
2.	Compute: After inputting text, users click the “Compute” button to generate the KWIC index.
3.	Output: The KWIC index is displayed in a read-only text area below the input.
4.	Clear Input/Output: Users can clear the input or output by clicking the respective “Reset Input” or “Reset Output” buttons.

# User Guide

## Computing KWIC Index and viewing the results

1.	To Input Text, enter lines of text into the text area provided, by clicking inside the text area and then using your keyboard or other input method.

•	Each line consists of words separated by spaces.

•	Only characters a…z, A…Z are accepted by the system, others will be erased.

![image](https://github.com/Nellak2017/Software-Architecture-A3-A4/assets/46159829/7fee1a57-81e3-4698-9b47-e4005df249b3)

Figure 1. Demonstration of inputting text into the KWIC Text Area Input 
 

2.	After Inputting Text, click the “Compute” button to generate the KWIC Index.

•	The system will process the input and display the result in the output text area that is read only.

•	Each line in the KWIC Index represents a circular shift of the original text, and sorted in alphabetical order.

![image](https://github.com/Nellak2017/Software-Architecture-A3-A4/assets/46159829/b1a16ad2-7543-463e-8b43-6a9b00378d29) 

Figure 2. Demonstration of output text from the example input
 
## Clearing the Input Output

1.	To clear the input text, click the “Reset Input” button.

•	It will only clear the input text.

![image](https://github.com/Nellak2017/Software-Architecture-A3-A4/assets/46159829/00440150-2211-464e-bd05-1277bcad592e) 

Figure 3. Demonstration of clearing input text from the example input

2.	To clear the output text, click the “Reset Output” button.

•	It will only clear the output text.

![image](https://github.com/Nellak2017/Software-Architecture-A3-A4/assets/46159829/420f9eb8-29ed-4989-8742-c497c7e20689) 

Figure 4. Demonstration of clearing output text from the example input
 
# Setting up the Key Word In Context System to Run Locally

Because the Key Word In Context System is not hosted online with a Domain, you must run it from the zip file that is provided from Github in Local Host 3000.

1.	Download the source code file from Github

2.	In the terminal, where the project is located, do the command:

```bash
npm install
```

•	This will download all the dependencies in the KWIC project.

•	Note that this will require 288 MB of memory on your PC.

3.	In the terminal, do the command:

```bash
npm run dev
```

•	This will run your program in localhost:3000

•	Ensure that nothing else is running on localhost:3000 before doing this

4.	Navigate to localhost:3000 in your preferred browser.

•	This will let you run the KWIC program in development mode.

•	If you want a production build, you will instead do the npm run build command.
 
![image](https://github.com/Nellak2017/Software-Architecture-A3-A4/assets/46159829/1e7507e7-e982-496e-994c-97c3b479de49)

Figure 5. KWIC system displayed in your browser at localhost:3000
