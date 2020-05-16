# Do Things: A Clojure Crash Course

## Forms

All Clojure code is written in a uniform structure. The two structures are:

- literal representations of data structures (e.g. numbers, strings, maps and vectors)
- operations

The term `form` refers to valid code (also may be called an `expression`). Clojure evaluates every form to produce a value. These are all valid forms:

```clj
1
"a string"
["a" "vector" "of" "strings"]
```

Realistically, wouldn't just use free-floating literals. Would instead use them in operations. All operations take the form `open parens, operator, operands, closing parens` - `(operator operand1 operand2 ... operandn)`

## Control Flow

Three basic control flow operators are `if`, `do` and `when`

### if

The general structure of an `if` expression. A Boolean form is just a form that evaluates to a truthy or falsey value.

```clj
(if boolean-form
  then-form
  optional-else-form)

(if true
  "By Zeus's hammer!"
  "By Aquaman's trident!")
; => "By Zeus's hammer!"

(if false
  "By Zeus's hammer!"
  "By Aquaman's trident!")
; => "By Aquaman's trident!"
```

You can also omit the else branch. If you do that and the Boolean expression is false, Clojure returns nil, like this:

```clj
(if false
  "By Odin's Elbow!")
; => nil
```

Notice that `if` uses operand position to associate operands with the then and else branches: the first operand is the then branch, and the second operand is the (optional) else branch. As a result, each branch can have only one form. To get around this, can use the `do` operator

### do

Lets you wrap up multiple forms in parentheses and run each of them

```clj
(if true
  (do (println "Success!")
      "By Zeus's hammer!")
  (do (println "Failure!")
      "By Aquaman's trident!"))
; => Success! -> this is printed
; => "By Zeus's hammer!" -> this is returned
```

### when

`when` is like a combination of `if` and `do` with no else branch. Should use `when` when if you want to do multiple things when some condition is true, and you always want to return nil when the condition is false. Example below

```clj
(when true
  (println "Success!")
  "abra cadabra")
; => Success!
; => "abra cadabra"
```

### nil, true, false, Truthiness, Equality, and Boolean Expressions

Clojure has `true` and `false` values. `nil` is used to indicate `no value` in Clojure. Can check if a value is `nil` by using the `nil?` function

```clj
(nil? 1)
; => false

(nil? nil)
; => true
```

Both `nil` and `false` represent logical falsiness, whereas all other values are logically truthy. Truthy and falsey refer to how a value is treated in a Boolean expression, like the first expression passed to `if`

The equality operator in Clojure is `=` - don't need to use other comparison operators to compare Clojure's built-in data structures
**Note:** interestingly, seems that Clojure objects (or what I would think would be considered objects, such as vectors and lists) don't seem to compare equality by reference, but rather by the elements they hold

```clj
(= [] []) ; evaluates to true
(= [1] [1]) ; evaluates to true

(= [1] [2]) ; evaluates to false
```

Clojure uses the boolean operators `or` and `and`. The `or` operator returns either the first truthy value or the last value if none are truthy. The `and` operator returns either the first falsey value, or if no values are falsey, the last truthy value. Looking at `or`:

```clj
(or false nil :large_I_mean_venti :why_cant_I_just_say_large)
; => :large_I_mean_venti

(or (= 0 1) (= "yes" "no"))
; => false

(or nil)
; => nil
```

And looking at `and`:

```clj
(and :free_wifi :hot_coffee)
; => :hot_coffee

(and :feelin_super_cool nil false)
; => nil
```

## Naming Values with def

The `def` keyword is used to **bind** a name to a value in Clojure. Using the word `bind` instead of assign here because values are generally immutable/never re-assigned in Clojure as opposed to more OOP languages that favor re-assignment of variables

```clj
(def failed-protagonist-names
  ["Larry Potter" "Doreen the Explorer" "The Incredible Bulk"])

failed-protagonist-names
; => ["Larry Potter" "Doreen the Explorer" "The Incredible Bulk"]
```

Here we are binding the name `failed-protagonist-names` to a vector containing three elements

We could technically re-assign a value in Clojure to achieve some end like below. However, it can make a program more difficult to understand since we might not understand why a value changed or which name is associated with a particular value

```clj
(def severity :mild)
(def error-message "OH GOD! IT'S A DISASTER! WE'RE ")
(if (= severity :mild)
  (def error-message (str error-message "MILDLY INCONVENIENCED!"))
  (def error-message (str error-message "DOOOOOOOMED!")))
```

Instead, might opt to right the above like so in a function:

```clj
(defn error-message
  [severity]
  (str "OH GOD! IT'S A DISASTER! WE'RE "
       (if (= severity :mild)
         "MILDLY INCONVENIENCED!"
         "DOOOOOOOMED!")))

(error-message :mild)
; => "OH GOD! IT'S A DISASTER! WE'RE MILDLY INCONVENIENCED!"
```

---

## Data Structures

Clojure comes with a few built-in data structures, and all of them are immutable - you can't change them in place. Clojure has no equivalent of something like re-assigning the value at an array at index 0.

### Numbers

The number implementation in Clojure can be pretty advanced, so for now we'll focus on working with floats and integers, as well as ratios (Which Clojure can represent directly). Below are an integer, float and ratio, respectively

```clj
93
1.2
1/5
```

### Strings

Clojure only allows double quotes `"Strings"` for strings. Clojure also does not have string interpolation, and only allows concatenation via the `str` function

### Maps

Maps are similar to dictionaries or hashes in other languages. They're a way of associating some value with some other value. The two kinds of maps in Clojure are hash maps and and sorted maps. For now, will only cover hash maps. This is an empty map literal `{}`

In this example, `:first-name` and `:last-name` are keywords (covered later)

```clj
{
  :first-name "Charlie"
  :last-name "McFishwich"
}
```

Here we associate `"string-key"` with the `+` function

```clj
{"string-key" +}
```

We can also nest maps

```clj
{:name {:first "John" :middle "Jacob" :last "Jingleheimerschmidt"}}
```

Notice the values in a map can be of any type - string, numbers, maps, vectors, functions, etc.

Besides using hash map literals, can also build a map using the `hash-map` function

```clj
(hash-map :a 1 :b 2)
```

You can look up values in maps with the get function:

```clj
(get {:a 0 :b 1} :b)
; => 1

(get {:a 0 :b {:c "ho hum"}} :b)
; => {:c "ho hum"}
```

"`get` will return `nil` if it doesn’t find your key, or you can give it a default value to return, such as `"unicorns?"`:"

```clj
(get {:a 0 :b 1} :c) ; :c doesn't exist so nil is returned
; => nil

(get {:a 0 :b 1} :c "unicorns?") ; look up :c and if not found, return "unicorns?"
; => "unicorns?"
```

"The `get-in` function lets you look up values in nested maps:"

```clj
(get-in {:a 0 :b {:c "ho hum"}} [:b :c]) ; we are looking up :b, then within :b we are looking up :c
; => "ho hum"
```

Another way to look up a value in a map is to treat the map like a function with the key as its argument:

```clj
({:name "The Human Coffeepot"} :name) ; the map is being used like an operator here
; => "The Human Coffeepot"
```

"Another cool thing you can do with maps is use keywords as functions to look up their values, which leads to the next subject, keywords."

### Keywords

Clojure keywords are primarily used as keys in maps as seen previously

"Keywords can be used as functions that look up the corresponding value in a data structure. For example, you can look up `:a` in a map:"

```clj
(:a {:a 1 :b 2 :c 3})
; => 1
```

which is equivalent to:

```clj
(get {:a 1 :b 2 :c 3} :a)
; => 1
```

You can also assign a default value using this syntax:

```clj
(:d {:a 1 :b 2 :c 3} "No gnome knows homes like Noah knows") ; we didn't find the :d key in the map, so default value is returned
; => "No gnome knows homes like Noah knows"
```

**Using a keyword as a function is pleasantly succinct, and Real Clojurists do it all the time. You should do it too!**

### Vectors

A vector is similar to an array in that it's a 0-indexed collection

```clj
(get [3 2 1] 0) ; getting the 0th element of a vector
; => 3
```

Vector elements can be of any type, and you can mix types. Also notice we are using the same `get` function we were using when looking up keys in a hash map

Can also create vectors with the `vector` function

```clj
(vector "creepy" "full" "moon")
; => ["creepy" "full" "moon"]
```

Can use the `conj` function to add additional elements to the vector. Elements are added to the end of a vector with `conj`

```clj
(conj [1 2 3] 4) ; taking the vector [1 2 3] and pushing 4 onto the end
; => [1 2 3 4]
```

Vectors aren't the only way to store sequences - Clojure also has lists

### Lists

"Lists are similar to vectors in that they’re linear collections of values. But there are some differences. For example, you can’t retrieve list elements with get. To write a list literal, just insert the elements into parentheses and use a single quote at the beginning:"

```clj
'(1 2 3 4)
; => (1 2 3 4)
```

Notice that when the REPL prints out the list, it doesn’t include the `single quote`. We’ll come back to why that happens later, in Chapter 7. If you want to retrieve an element from a list, you can use the `nth` function:

```clj
(nth '(:a :b :c) 0) ; grab the 0th item in the list (from 0 index)
; => :a

(nth '(:a :b :c) 2) ; grab the 2nd element in the list (from 0 index)
; => :c
```

Note that using `nth` to grab an item from a list is slower than using `get` to grab an element from a map or vector (probably linear time vs constant time (or log(n) because of structural sharing?))

Lists can contain any values, and you can create lists using the `list` function

```clj
(list 1 "two" {3 4})
; => (1 "two" {3 4})
```

The `conj` function adds elements to the beginning (head) of a list

```clj
(conj '(1 2 3) 4)
; => (4 1 2 3)
```

"When should you use a list and when should you use a vector? A good rule of thumb is that if you need to easily add items to the beginning of a sequence or if you’re writing a macro, you should use a list. Otherwise, you should use a vector. As you learn more, you’ll get a good feel for when to use which."

### Sets

"Sets are collections of unique values. Clojure has two kinds of sets: hash sets and sorted sets. I’ll focus on hash sets because they’re used more often. Here’s the literal notation for a hash set:"

```clj
#{"kurt vonnegut" 20 :icicle}
```

Can also use `hash-set` to create a set:

```clj
(hash-set 1 1 2 2)
; => #{1 2}
```

"Note that multiple instances of a value become one unique value in the set, so we’re left with a single 1 and a single 2. If you try to add a value to a set that already contains that value (such as :b in the following code), it will still have only one of that value:"

```clj
(conj #{:a :b} :b)
; => #{:a :b}
```

"You can also create sets from existing vectors and lists by using the set function:"

```clj
(set [3 3 3 4 4])
; => #{3 4}
```

Can check for `set` membership using the `contains?` function, by using `get`, or by using a keyword as a function with the set as its argument. The `contains?` function will return `true` or `false`, where as using `get` or keyword lookup will return `nil` if the value is not found, or the value if it is found

```clj
(contains? #{:a :b} :a)
; => true

(contains? #{:a :b} 3)
; => false

(contains? #{nil} nil)
; => true

(:a #{:a :b}) ; keyword look up
; => :a

(get #{:a :b} :a) ; get look up
; => :a

(get #{:a nil} nil)
; => nil

(get #{:a :b} "kurt vonnegut")
; => nil
```

**"Notice that using get to test whether a set contains nil will always return nil, which is confusing. contains? may be the better option when you’re testing specifically for set membership."**

### Simplicity

Notice that the treatment of data structures so far doesn't include how to create new classes or types. Clojure emphasizes reaching for the built-in data structures first. Keep an eye out for the ways that you gain code resuability by sticking to basic data structures!

---

## Functions

This section will go over:

- calling functions
- how functions differ from macros and special forms
- defining functions
- anonymous functions
- returning functions

### Calling Functions

By now have seen many examples of function calls such as `(+ 1 2 3 4)`. Remember that all Clojure operations have the same syntax. A function call is is just another term for an operation where the operator is a function or a function expression (an expression that returns a function). Some interesting code can be written this way - below is a function expression that returns the `+` function:

```clj
(or + -) ; since OR returns the first truthy value, the string representation of the + function is returned
; => #<core$_PLUS_ clojure.core$_PLUS_@76dace31>
```

Can also use the above expression in another function:

```clj
((or + -) 1 2 3) ; we select the `+` function and apply it to the arguments to sum up 1 + 2 + 3
; => 6
```

More expression are below:

```clj
((and (= 1 1) +) 1 2 3) ; return value of AND is first falsey value or last truthy value
; first, (= 1 1) evaluates and is equal to true, and then AND returns + as + is the last truthy value in the expression
; the call resolves to (+ 1 2 3) => 6
; => 6

((first [+ 0]) 1 2 3) ; take the first value of the vector [+ 0] resolves first, evaluating to (+ 1 2 3)
; => 6
```

However, for invalid function calls such as the below, an error will be thrown.

```clj
(1 2 3 4)
("test" 1 2 3)

;error is thrown
;ClassCastException java.lang.String cannot be cast to clojure.lang.IFn
;user/eval728 (NO_SOURCE_FILE:1)
```

"You’re likely to see this error many times as you continue with Clojure: <x> cannot be cast to clojure.lang.IFn just means that you’re trying to use something as a function when it’s not."

Functions can also be passed as arguments or returned in Clojure, so functions are first-class/higher-order functions exist. The `map` function is one example of a higher order function. It creates a new list by applying a function to each member of a collection. In below example, the `inc` function increments a number by 1:

```clj
(inc 1.1)
; => 2.1

(map inc [0 1 2 3]) ; each element of the vector has the inc function applied to it and a new list is returned
; => (1 2 3 4)
```

**"(Note that map doesn’t return a vector, even though we supplied a vector as an argument. You’ll learn why in Chapter 4. For now, just trust that this is okay and expected.)"**

"Clojure’s support for first-class functions allows you to build more power­ful abstractions than you can in languages without them. Those unfamiliar with this kind of programming think of functions as allowing you to generalize operations over data instances. For example, the + function abstracts addition over any specific numbers. By contrast, Clojure (and all Lisps) allows you to create functions that generalize over processes. `map` allows you to generalize the process of transforming a collection by applying a function—any function—over any collection.

The last detail that you need know about function calls is that Clojure evaluates all function arguments recursively before passing them to the function. Here’s how Clojure would evaluate a function call whose arguments are also function calls:"

```clj
(+ (inc 199) (/ 100 (- 7 2)))
(+ 200 (/ 100 (- 7 2))) ; evaluated "(inc 199)"
(+ 200 (/ 100 5)) ; evaluated (- 7 2)
(+ 200 20) ; evaluated (/ 100 5)
220 ; final evaluation
```

### Function Calls, Macro Calls, and Special Forms

One difference between a special form and a normal expression is that they might not always evaluate all of their operands, e.g. with the `if` special form. Another feature of them is you cannot use them as arguments in a function call

### Defining Functions

Functions composed of five main parts:

- `defn`
- function name
- an optional docstring describing the function
- parameters listed in brackets
- function body

### Parameters and Arity

Clojure functions can be defined with zero or more parameters - number of parameters is a functions arity.

```clj
(defn no-params
  []
  "I take no parameters!")
(defn one-param
  [x]
  (str "I take one parameter: " x))
(defn two-params
  [x y]
  (str "Two parameters! That's nothing! Pah! I will smoosh them "
  "together to spite you! " x y))
```

Functions also support arity overloading - can define multiple versions of the same function name with different arity

```clj
(defn multi-arity
  ;; 3-arity arguments and body
  ([first-arg second-arg third-arg]
     (do-things first-arg second-arg third-arg))
  ;; 2-arity arguments and body
  ([first-arg second-arg]
     (do-things first-arg second-arg))
  ;; 1-arity arguments and body
  ([first-arg]
     (do-things first-arg)))
```

This is one way to provide default parameters - can define functions in terms of themselves of different arity

```clj
(defn x-chop
  "Describe the kind of chop you're inflicting on someone"
  ([name chop-type]
     (str "I " chop-type " chop " name "! Take that!"))
  ([name]
     (x-chop name "karate")))
```

Clojure also allows you to define variable-arity functions by including the `rest` parameter - this parameter puts the rest of the arguments of a functions into a list with a name defined after a `&`

```clj
(defn codger-communication
  [whippersnapper]
  (str "Get off my lawn, " whippersnapper "!!!"))

(defn codger
➊   [& whippersnappers]
  (map codger-communication whippersnappers))

(codger "Billy" "Anne-Marie" "The Incredible Bulk")
; => ("Get off my lawn, Billy!!!"
      "Get off my lawn, Anne-Marie!!!"
      "Get off my lawn, The Incredible Bulk!!!")
```

Can mix normal parameters and the rest parameter, but rest parameter has to be the last one

```clj
(defn favorite-things
  [name & things]
  (str "Hi, " name ", here are my favorite things: "
       (clojure.string/join ", " things)))

(favorite-things "Doreen" "gum" "shoes" "kara-te")
; => "Hi, Doreen, here are my favorite things: gum, shoes, kara-te"
```

### Destructuring

Idea behind destructuring is that it lets you concisely bind names to values within a collection

```clj
;; Return the first element of a collection
(defn my-first
  [[first-thing]] ; Notice that first-thing is within a vector - function expects a list (vector only?), and by defining [first-thing] in
  ; parameter list, we bind first-thing to the first item in the list
  first-thing)

(my-first ["oven" "bike" "war-axe"])
; => "oven"
```

When destructuring a vector or list, you can specify as many bindings as you'd like as well as use rest parameters

```clj
(defn chooser
  [[first-choice second-choice & unimportant-choices]]
  (println (str "Your first choice is: " first-choice))
  (println (str "Your second choice is: " second-choice))
  (println (str "We're ignoring the rest of your choices. "
                "Here they are in case you need to cry over them: "
                (clojure.string/join ", " unimportant-choices))))

(chooser ["Marmalade", "Handsome Jack", "Pigpen", "Aquaman"])
; => Your first choice is: Marmalade
; => Your second choice is: Handsome Jack
; => We're ignoring the rest of your choices. Here they are in case \
     you need to cry over them: Pigpen, Aquaman
```

You can also destructure maps.

```clj
(defn announce-treasure-location
➊   [{lat :lat lng :lng}] ; expects a map as an argument and binds the symbol lat to the value of the key :lat
; and binds the symbol lng to the value of the key :lng - if keys aren't found, bound value will be nil
  (println (str "Treasure lat: " lat))
  (println (str "Treasure lng: " lng)))

(announce-treasure-location {:lat 28.22 :lng 81.33})
; => Treasure lat: 100
; => Treasure lng: 50
```

A shorter syntax to destructure a map:

```clj
(defn announce-treasure-location ; pulls the keys directly from the map and binds their symbol to their value
  [{:keys [lat lng]}]
  (println (str "Treasure lat: " lat))
  (println (str "Treasure lng: " lng)))
```

Can retain access to original map argument by using the `:as` keyword

```clj
(defn receive-treasure-location
  [{:keys [lat lng] :as treasure-location}]
  (println (str "Treasure lat: " lat))
  (println (str "Treasure lng: " lng))

  ;; One would assume that this would put in new coordinates for your ship
  (steer-ship! treasure-location))
```

In general, can think of destructuring in Clojure as how to associate names with values in a list, map, set or vector

### Function Body

A function body can contain forms of any kind. Clojure automatically returns the last form evaluated

```clj
(defn illustrative-function
  []
  (+ 1 304)
  30
  "joe")

(illustrative-function)
; => "joe"

(defn number-comment
  [x]
  (if (> x 6)
    "Oh my gosh! What a big number!"
    "That number's OK, I guess"))

(number-comment 5)
; => "That number's OK, I guess"

(number-comment 7)
; => "Oh my gosh! What a big number!"
```

### All Functions Are Created Equal

To note, Clojure has no privileged functions. `+`, `-`, `inc` and `map` are just functions and no different from any you define yourself

### Anonymous Functions

Anonymous functions (functions without names) can be created. They are often used in fact. Can create an anonymous functions in two ways:

- using `fn`

```clj
(fn [param-list]
  function body)

; an example below

(map (fn [name] (str "Hi, " name)) ; we apply map using an anonymous function (takes a name and returns a (str) concat) and a vector of names
     ["Darth Vader" "Mr. Magoo"])
; => ("Hi, Darth Vader" "Hi, Mr. Magoo")

((fn [x] (* x 3)) 8) ; we define an anonymous function that takes x (a number) and returns x * 3. We apply the function to the number 8
; => 24
```

You can treat `fn` nearly identically to `defn`. The param lists and function bodies work exactly the same. You can use destructuring, rest parameters and so on. Can even associate an anonymous function with a name using `def`

```clj
(def my-special-multiplier (fn [x] (* x 3)))
(my-special-multiplier 12)
; => 36
```

Another way to define anonymous functions is using `#()` syntax. This is made possible using `reader macros` - will learn about that later.

```clj
#(* % 3) ; an anonymous function that takes an argument and applies * the argument and 3

(#(* % 3) 8)
; => 24
```

An example of passing an anonymous function to `map`

```clj
(map #(str "Hi, " %)
     ["Darth Vader" "Mr. Magoo"])
; => ("Hi, Darth Vader" "Hi, Mr. Magoo")
```

The `%` sign indicates the argument passed to the function. If the anonymous function takes multiple arguments, you can distinguish them like this: `%1`, `%2`, `%3` and so on - `%` is equivalent to `%1`

```clj
(#(str %1 " and " %2) "cornbread" "butter beans")
; => "cornbread and butter beans"
```

Can also pass a rest parameter with `%&`

```clj
(#(identity %&) 1 "blarg" :yip)
; => (1 "blarg" :yip)
```

"In this case, you applied the `identity` function to the rest argument. Identity returns the argument it’s given without altering it. Rest arguments are stored as lists, so the function application returns a list of all the arguments."

The `#()` syntax is better for shorter functions as it is more compact, but if your anonymous function is going to be long, better to use `fn` form

### Returning Functions

Functions can return other functions to form closures

```clj
(defn inc-maker
  "Create a custom incrementor"
  [inc-by]
  #(+ % inc-by))

(def inc3 (inc-maker 3))

(inc3 7)
; => 10
```

---

## Pulling It All Together

Will write a few functions with the purpose of smacking hobbits. First, need to model body parts. Each body part will include its relative size to indicate how likely to be hit it is. To avoid repetition, the model will include entries only for `left foot`, `left ear` and so on. We will need a function to fully symmetrize the model to create a `right foot`, `right ear`, etc. Finally, will create a function that iterates over the body parts and randomly chooses the one hit - along the way will learn about new Clojure tools: `let` expressions, loops and regular expressions

### The Shire's Next Top Model

For now we will model the hobbit's body parts in a vector of maps where each map has the name of a body part and a size - for now, it only contains singular body parts and the left version of body parts

```clj
(def asym-hobbit-body-parts [{:name "head" :size 3}
                             {:name "left-eye" :size 1}
                             {:name "left-ear" :size 1}
                             {:name "mouth" :size 1}
                             {:name "nose" :size 1}
                             {:name "neck" :size 2}
                             {:name "left-shoulder" :size 3}
                             {:name "left-upper-arm" :size 3}
                             {:name "chest" :size 10}
                             {:name "back" :size 10}
                             {:name "left-forearm" :size 3}
                             {:name "abdomen" :size 6}
                             {:name "left-kidney" :size 1}
                             {:name "left-hand" :size 2}
                             {:name "left-knee" :size 2}
                             {:name "left-thigh" :size 4}
                             {:name "left-lower-leg" :size 3}
                             {:name "left-achilles" :size 1}
                             {:name "left-foot" :size 2}])
```

To add in the right-side version of all the body parts, we will write a few functions to generate the parts

```clj
(defn matching-part
  [part]
  {:name (clojure.string/replace (:name part) #"^left-" "right-")
   :size (:size part)})
```

The above function takes a part (one of the maps in the body parts vector) and returns a new map with a body part having `left-` in the name being replaced with `right-` body part and the same size as the left body part, e.g. calling `(matching-part {:name "left-eye" :size 1})` outputs a new map looking like `{:name "right-eye" :size 1}`. **Note** not sure, but I'm assuming if the reg-ex doesn't replace anything like in the case of `{:name head :size 3}` then a copy of the map is returned with the same values - this was confirmed by calling `(matching-part {:name head :size 3})` in the repl

We also define a function to symmetrize all of our `asym-hobbit-body-parts` using the `matching-part` function below

```clj
(defn symmetrize-body-parts
  "Expects a seq of maps that have a :name and :size"
  [asym-body-parts]
  (loop [remaining-asym-parts asym-body-parts
         final-body-parts []]
    (if (empty? remaining-asym-parts)
      final-body-parts
      (let [[part & remaining] remaining-asym-parts]
        (recur remaining
               (into final-body-parts
                     (set [part (matching-part part)])))))))
```

When we call `symmetrize-body-parts` on `asym-body-parts` we get a fully symmetrical hobbit

```clj
(symmetrize-body-parts asym-hobbit-body-parts)
; => [{:name "head", :size 3}
      {:name "left-eye", :size 1}
      {:name "right-eye", :size 1}
      {:name "left-ear", :size 1}
      {:name "right-ear", :size 1}
      {:name "mouth", :size 1}
      {:name "nose", :size 1}
      {:name "neck", :size 2}
      {:name "left-shoulder", :size 3}
      {:name "right-shoulder", :size 3}
      {:name "left-upper-arm", :size 3}
      {:name "right-upper-arm", :size 3}
      {:name "chest", :size 10}
      {:name "back", :size 10}
      {:name "left-forearm", :size 3}
      {:name "right-forearm", :size 3}
      {:name "abdomen", :size 6}
      {:name "left-kidney", :size 1}
      {:name "right-kidney", :size 1}
      {:name "left-hand", :size 2}
      {:name "right-hand", :size 2}
      {:name "left-knee", :size 2}
      {:name "right-knee", :size 2}
      {:name "left-thigh", :size 4}
      {:name "right-thigh", :size 4}
      {:name "left-lower-leg", :size 3}
      {:name "right-lower-leg", :size 3}
      {:name "left-achilles", :size 1}
      {:name "right-achilles", :size 1}
      {:name "left-foot", :size 2}
      {:name "right-foot", :size 2}]
```

Some new functions and operations are introduced in `symmetrize-body-parts` so let's take a look at each of them

### let

In the `symmetrize-body-parts` definition, there is a form we see: `(let ...)`

**NOTE:** TIL, to load a file into the REPL in IntelliJ/Cursive, the shortcut `Alt+Shift+L` does so - no need to restart repl every time with `Ctrl+F5`

`let` binds names to values. An example is below

```clj
(let [x 3] ; binds the number 3 to the symbol x and returns x
  x)
; => 3

(def dalmatian-list
  ["Pongo" "Perdita" "Puppy 1" "Puppy 2"]) ; defines a vector of strings representing dalmatian names
(let [dalmatians (take 2 dalmatian-list)] ; binds the symbol dalmatians to the result of calling (take 2 dalmatian-list)
  dalmatians) ; returns value bound to dalmatians (first two dalmatians in the list)
; => ("Pongo" "Perdita")
```

`let` also introduces a new scope. In the below snippet, you are saying “I want x to be 0 in the global context, but within the context of this `let` expression, it should be 1.”

```clj
(def x 0) ; bind x to the number 0 in "global" scope
(let [x 1] x) ; bind x to the number 1 in let scope and return x from this scope
; => 1
```

Can also reference existing bindings in a `let` binding

```clj
(def x 0) ; bind x to number 0 in global scope/context
(let [x (inc x)] x) ; in context of let, x is bound to the expression (inc x) and then returned
; => 1
```

Can also use `rest` parameters in `let`, just like with functions

```clj
(let [[pongo & dalmatians] dalmatian-list] ; in this case, we expect a list or vector and bind the first element to the symbol pongo, and the rest of the elements (as a list? seq? not sure) called dalmatians
  [pongo dalmatians]) ; we return a vector with the first element as the value bound to pongo, and the second as the value bound to dalmatians
; => ["Pongo" ("Perdita" "Puppy 1" "Puppy 2")]
```

Note, the value of a `let` form is the last form in its body that is evaluated, and also follows the same destructuring rules seen previously with functions

`let` forms have two main uses - first, they provide clarity by allowing us to name things. Second, they allow you to evaluate an expression only once and reuse the result (important when you need to reuse the result of an expensive function call like a network api call. Also important when the expression has side-effects)

Looking at the `let` form in our hobbit part symmetrizing function, let's try to understand what's going on

```clj
(let [[part & remaining] remaining-asym-parts]
  (recur remaining
         (into final-body-parts
               (set [part (matching-part part)]))))
```

"This code tells Clojure, “Create a new scope. Within it, associate `part` with the first element of `remaining-asym-parts`. Associate `remaining` with the rest of the elements in `remaining-asym-parts`.”"

Regarding body of the `let` expression, we will learn about `recur` in the next section

```clj
(into final-body-parts
  (set [part (matching-part part)]))
```

The function call above tells Clojure “Use the `set` function to create a set consisting of `part` and its matching part. Then use the function into to add the elements of that set to the vector final-body-parts.” We create a set here to ensure that we are only adding unique elements to `final-body-parts` since `part` and (`matching-part part)` are sometimes the same thing, as will be seen in a following section covering regular expressions (one case this might happen is when we call `(matching-part {:name "head" :size 3})`)

A simple example of using the `set` function with `into` is below

```clj
(into [] (set [:a :a])) ; first, (set [:a :a]) returns the set #{:a} because sets can't contain duplicates. Then, (into [] #{:a}) returns the vector [:a]
; => [:a]
```

To note, if we didn't use `let` the expression where we use it would have looked a bit messier and difficult to read

```clj
(recur (rest remaining-asym-parts)
       (into final-body-parts
             (set [(first remaining-asym-parts) (matching-part (first remaining-asym-parts))])))
```

So `let` is a useful way to introduce local names for values which helps simplify code

### loop

In the `symmetrize-body-parts` function we use `loop` which is another way to do recursion in Clojure

```clj
(loop [iteration 0] ; this line begins the loop and introduces a binding with an initial value. On the first pass through the loop, iterations has a value of 0. Then a short message is printed and the value of iteration is checked - if iteration is greater than 3 then we print "Goodbye!". If iteration is not greater than 3, we recur with iteration incremented by 1
  (println (str "Iteration " iteration))
  (if (> iteration 3)
    (println "Goodbye!")
    (recur (inc iteration))))
; => Iteration 0
; => Iteration 1
; => Iteration 2
; => Iteration 3
; => Iteration 4
; => Goodbye!
```

It's as if `loop` creates an anonymous function with a parameter named `iteration` and `recur` allows you to call the function from within itself, passing the argument `(inc iteration)`. It is even possible to achieve the same thing using a normal function defintion

```clj
(defn recursive-printer
  ([]
     (recursive-printer 0))
  ([iteration]
     (println iteration)
     (if (> iteration 3)
       (println "Goodbye!")
       (recursive-printer (inc iteration)))))
(recursive-printer)
; => Iteration 0
; => Iteration 1
; => Iteration 2
; => Iteration 3
; => Iteration 4
; => Goodbye!
```

However, as seen above it is a bit more verbose. Additionally, `loop` has much better performance apparently (b/c of tail call elimination?)

### Regular Expressions
