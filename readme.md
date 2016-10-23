# dangerously-set-inner-html

`dangerouslySetInnerHTML` that evaluates `<script>` tags

## install

```
npm install --save dangerously-set-inner-html
```

## usage

```js
const React = require('react');
const InnerHTML = require('dangerously-set-inner-html')

const html = `
  <div id="root"></div>
  <script>
    window.alert('hello from dangerously-set-inner-html');
  </script>
`

module.exports = () => {
  return (
    <InnerHTML html={html) />
  );
};
```

## license

MIT