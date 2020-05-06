# Differences Between Typescript Interfaces and Types as of 5/28/2019 Article

A seemingly good resource I found on 4/26/2020 for this distinction is here: `https://dev.to/stereobooster/typescript-type-vs-interface-2n0c`

- the comments section also seems to have good information, specifically by Massimo Artizzu (@MaxArt2501)

## Official Docs Page Updated as of 1/16/2020

### Interfaces vs. Type Aliases

As we mentioned, type aliases can act sort of like interfaces; however, there are some subtle differences.

One difference is that interfaces create a new name that is used everywhere. Type aliases don't create a new name — for instance, error messages won't use the alias name. In the code below, hovering over interfaced in an editor will show that it returns an Interface, but will show that aliased returns object literal type.

```typescript
type Alias = { num: number };
interface Interface {
  num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
```

In older versions of TypeScript, type aliases couldn't be extended or implemented from (nor could they extend/implement other types). As of version 2.7, type aliases can be extended by creating a new intersection type e.g. type Cat = Animal & { purrs: true }.

Because an ideal property of software is being open to extension, you should always use an interface over a type alias if possible.

On the other hand, if you can't express some shape with an interface and you need to use a union or tuple type, type aliases are usually the way to go.

## Interfaces Are Restricted to an Object Type

For example, the following type declaration cannot be represented using an interface `type info = string | { name: string };`

## You Can Merge Interfaces But Not Types

"Multiple declarations with the same name are valid only when used with `interface`. Doing so doesn't override the previous one but produces a merged result containing members from all declarations
"

```typescript
interface DudeInterface {
  name: string;
}

interface DudeInterface {
  age: number;
}

const pawel: DudeInterface = {
  name: "Pawel Grzybek",
  age: 31
};
```

## Type Aliases Can Use Computed Properties

The below compiles in Typescript, while if trying to use an interface an error is thrown

```typescript
type Keys = "firstname" | "surname";

type DudeType = {
  [key in Keys]: string;
};

const test: DudeType = {
  firstname: "Pawel",
  surname: "Grzybek"
};
```

## Deferred Type Resolution of Interfaces vs Eager Type Aliases

asd

## Comment By Daniel Lane Going into More Specifics

"Explain that an interface is a promise or contract to implement a data shape, you kinda touch on this but it's definitely worth further explanation. You should do the same for types as well, as a type is a definition of a type of data that can be declared and assigned.

Many people use interfaces as types, which isn't strictly the correct way to use them, certainly not in other languages anyways.

Using a type the correct way

```typescript
type Communication = string | { message: string };

const comm1: Communication = "lol";
const comm2: Communication = { message: "lol" };
```

Using a type the wrong way

```typescript
type Contract = {
  message: string;
  print: Function;
};
// This is syntactically correct, but since when do people implement a type?
// you declare and instantiate types, we implement interfaces as that's the purpose of polymorphism!
class MessageContract implements Contract {
  constructor(public message: string) {}
  print() {
    console.log(this.message);
  }
}
```

Using an interface the correct way by defining an interface and implementing it in a class

```typescript
interface Contract {
message: string;
print: Function;
}

class Messager implements Contract {
constructor(public message: string) { }
print() {
console.log(this.message);
}
}

const messager = new Messager('Hello World!);
messager.print();
```

Using an interface the incorrect way by using it as a type

```typescript
interface Messager {
  print: Function;
}

const messager: Messager = {
  print: () => {
    console.log("Hello!");
  }
};

messager.print();
```

I personally think the only other appropriate usage of an interface is to define the shape of arguments to a function as this is still technically a contract or promise of a data shape that the function expects.

```typescript
interface PropTypes {
  name: string;
  age: number;
}

const funkyFunc = (props: PropTypes) => {
  const { name, age } = props;
  console.log(`Hello ${name}, you're ${age} old!`);
};
```

Another key difference not expanded on enough imho is the deferred type resolution of interfaces. Interfaces can extend classes as well as types. The interface will inherit the properties and their types of a class when this is done which is super neat, I guess it's the point of what you're saying?

Types can't do this at all.

```typescript
class Messager {
  sayHello() {
  console.log('Hello!);
}
}

interface AwesomeMessager extends Messager {
  name: string;
}

class MessageLogger implements AwesomeMessager {
constructor(public name: string) {}
sayHello() {
console.log(`Hello ${this.name}!`);
}
}
```

"

## Resource

https://pawelgrzybek.com/typescript-interface-vs-type/
