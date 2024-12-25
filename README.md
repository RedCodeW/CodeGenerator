Document Language: [English](README.md), [中文](README.zh.md)
# Source Code Documentation Generator

## Introduction
This tool is used to generate TXT files of source code in the format required for software copyright applications.

## Software Architecture
This project is implemented using Electron+Vue3, supporting Windows and Linux systems (macOS users can download the source code and compile it themselves). It can generate corresponding source code documentation on the desktop based on specified file extensions within a folder.

## Usage Tutorial
For Windows and Linux systems, you can directly run the CodeGenerator (CodeGenerator.exe for Windows) in the corresponding folder under the application directory.

## Existing Issues
Since this is my first time using Electron, I encountered the following issues:
- The icon was set but did not display.
- Static resource issues after using electron-forge for packaging (after packaging, the dist folder needs to be manually copied to the generated folder).