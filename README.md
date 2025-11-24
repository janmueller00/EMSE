# Code Alignment Experiment

This is a small experiment that tests how people read code.

You will see short snippets of code with five variable declarations. Your task is to find **which line contains a type error** (a value that doesn’t match the variable type).

The experiment changes:

- **Alignment**: sometimes the `=` signs are aligned, sometimes not
- **Highlighting**: sometimes values are colored, sometimes not

You will do several trials, and for each snippet you press the number (1–5) of the line with the error.

The experiment is written in JavaScript using the Nof1 framework and runs in your browser.

At the end, the experiment outputs a CSV file that can be imported into Jamovi for an ANOVA analysis.