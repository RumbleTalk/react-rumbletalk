# react-rumbletalk

A React library for Rumbletalk group chats. Your platform for creating engaging messaging chat rooms for online events, web-site, platforms ,or apps.

![RumbleTalk Chat](https://d1pfint8izqszg.cloudfront.net/web7/images/q&a_fold.png)

## Features

- React compatibility
- CSS Customization
- Polls
- create multiple rooms
- Video and audio calls
- Approve message mode (Q&A)
- Backend agnostic
- voice and audio messages 
- Images, videos, files & emojis
- Private messages
- Text formatting - bold, italic, strikethrough, underline
- Online / Offline users status
- Flexible options and slots
- Different themes
- Floating or embed chat
- Mute all

## Installation

Using npm:

`npm i react-rumbletalk`

## Setup

**Import** `RumbleTalk` to your application

```javascript
import RumbleTalk from 'react-rumbletalk';
```

## Component usage

Use this in any of your `js/jsx` or `ts/tsx` file where you would like to place the chat

### Basic use
```javascript
<RumbleTalk hash='chat-hash' width={700} height={500} />
```

### Floating
```typescript
<RumbleTalk floating hash='chat-hash' side='right' image='https://d1pfint8izqszg.cloudfront.net/images/toolbar/toolbar.png' counter='14:23' />
```

<table>
  <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>hash</td>
    <td>string</td>
    <td></td>
    <td>The hash string which defines the chat to be loaded</td>
  </tr>
  <tr>
    <td>width</td>
    <td>number</td>
    <td><b>700</b></td>
    <td>Size of the width of the chat in pixels</td>
  </tr>
  <tr>
    <td>height</td>
    <td>number</td>
    <td><b>500</b></td>
    <td>Size of the height of the chat in pixels</td>
  </tr>
  <tr>
    <td>floating</td>
    <td>boolean</td>
    <td>false</td>
    <td>Displays the chat in a floating manner or else it is fixed</td>
  </tr>
  <tr>
    <td>side</td>
    <td>string</td>
    <td>right</td>
    <td>If <i>floating</i> is <i>true</i>, sets which side of the window will the floating chat be displayed, can only be either 'left' or 'right'</td>
  </tr>
  <tr>
    <td>image</td>
    <td>string</td>
    <td>
      <a href="https://d1pfint8izqszg.cloudfront.net/images/toolbar/toolbar.png" target="_blank">default image</a>
    </td>
    <td>If <i>floating</i> is <i>true</i>, sets the image used for the floating chat</td>
  </tr>
  <tr>
    <td>counter</td>
    <td>string</td>
    <td>14:23</td>
    <td>If <i>floating</i> is <i>true</i>, top:left coordinates of the counter/number of users in the chat</td>
  </tr>
</table>

## Service usage

These are the available methods you can use in the chat by importing the `RumbleTalk` file

> Note: To use this feature, you need to create a reference to the RumbleTalk component by using `this.ref = React.createRef()` for class component or `ref = React.useRef()` for functional component and add it to the component like this `ref={this.ref}` or `ref={ref}`

### Methods

#### login(data)

```javascript
this.ref.current.login({
    hash: hash,
    username: username,
    password: password,
    callback: (response) => {...}
});
```

Use to login to your chat

#### logout(data)

```javascript
this.ref.current.logout({
    hash: hash,
    username: username,
});
```

Use to logout from your chat

#### logoutCB(data)

```javascript
this.ref.current.logoutCB({
    hash: hash,
    username: username,
    callback: (reason) => {...},
});
```

Use to logout from your chat with callback

#### openPrivateChat(data)

```javascript
this.ref.current.openPrivateChat({
    hash: hash,
    username: username,
});
```

Use to open the private chat
