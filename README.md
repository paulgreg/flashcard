# Flashcard

A simple flashcard PWA.

You can try the app here : https://paulgreg.me/flashcard/ (but I strongly suggest you to host it yourself).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Settings

Before first run, copy `src/settings.json.dist` to `src/settings.json`.

By default, data is stored in localStorage.

You can save data on a server via [json-store](https://github.com/paulgreg/json-store) project. To do so, install it on your server then update `src/settings.json` : set `saveOnline` to true, update `saveUrl` and `authorization` according json-store configuration.


## Color palette

https://colorhunt.co/palette/2e4c6d396eb0daddfcfc997c
