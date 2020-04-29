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
