# WebChat

A mobile HTML5 Web App for the [chatter](https://github.com/snodgrass23/chatter) service.

## HTML Templates

All templates live in the `templates` directory and are compiled using [underscore templates](http://underscorejs.org/#template). If any file in this directory is added or changed, it must be compiled using `bin/compile-templates` before it can be used in the app. This script simply takes every file in the templates directory, runs it through the underscore `template` function, and outputs the resulting function to the global object `Templates`, with the key being whatever the file name was (i.e. a file called `title.html` would be accessible in `Templates["title"]`). This is done for performance reasons, to avoid having to compile templates each time the app is launched.