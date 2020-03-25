# Rest Syntax for Objects
- Can collect object properties into a new copy by destructuring and specifying a new object
- For example given the below object
```javascript
const dogWithColor = {
	breed: "Golden Retriever",
	age: 2,
	color: "Golden"
};
```
we can create a copy of the dogWithColor object minus the color property as follows:
```javascript
const {color, ...noColorDog} = dogWithColor;
```

Here, we destructure the `dogWithColor` object into two varaibles: the `color` variable is assigned to the `color` property of the `dogWithColor` object and `noColorDog` is assigned as an object with all of the other properties other than `color`
- Not positive, but this is most likely only a shallow copy, so any properties which are objects are likely still references to the original object property
