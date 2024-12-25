文档语言: [English](README.md), [中文](README.zh.md)
# 源代码文档生成器

## 介绍
用于生成软件著作权要求格式的源代码TXT文件

## 软件架构
本项目使用Electron+Vue3实现，支持Windows和Linux系统（mac系统可下载源码自行编译），可根据文件夹内的指定后缀名，在桌面上生成对应的源代码文档。

## 使用教程
Windows和Linux系统可直接运行application下对应文件夹的CodeGenerator（Windows为CodeGenerator.exe）

## 存在问题
因为是第一次使用Electron，遇到了如下几个问题：
- 设置了图标但是没有显示
- electron-foge打包后，静态资源问题，（生成后，dist需要手动复制到生成的文件夹里）
