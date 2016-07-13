# Licensify

To update every repo in an organization with a license, add the below to a file called env.js:

```js
//env.js
module.exports = {
  token: "token from https://github.com/settings/tokens/new",
  org: "ga-wdi-lessons"
}
```

```
$ node index.js
```
