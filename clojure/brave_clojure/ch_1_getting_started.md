# Getting Started

## Leiningen

Nowadays, Leiningen in the de facto build tool for Clojure. It can do many things, for now will focus on how we can use it to:

1. create a new Clojure project
2. run a Clojure project
3. build a Clojure project
4. use the REPL

We can create a project from the command line by running `lein new app clojure-noob`. This will create a project structure for us (seen below), though one that isn't particularly Clojure-y, just that Leiningen expects this type of structure when building a project

```
| .gitignore
| doc
| | intro.md
➊ | project.clj
| README.md
➋ | resources
| src
| | clojure_noob
➌ | | | core.clj
➍ | test
| | clojure_noob
| | | core_test.clj
```

First to note is `project.clj`. It is a config file for Leiningen to answer things like "what dependencies does this project have?" and "when this Clojure program runs, what function should run first?"

In general, source code will be saved in `src/<project_name>`. In this case, most code will be written in `src/clojure_noob/core.clj` for a while. The `test` directory is where tests live, and `resources` is where assets like images will be kept

In `src/clojure_noob/core.clj` it will look like the below. The `(ns clojure-noob.core)` line declares a namespace. The `-main` function is the entry point of the program

**Note:** tried creating a Clojure project directly in IntelliJ but that isn't the same as building with `lein new app my-app` - just build using the `lein` tool - maybe even just use `lein repl` instead of Cursive repl? To reload `lein repl` can use `(use '<your-name-space> :reload)`

- actually, Cursive repl seems fine

```clj
➊ (ns clojure-noob.core
  (:gen-class))

➋ (defn -main
  "I don't do a whole lot...yet."
  [& args]
➌   (println "Hello, World!"))
```

**NOTE** Second chapter is all about Emacs and Cider for writing Clojure, but I'll just skip that since I'm using IntelliJ with Cursive
