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
