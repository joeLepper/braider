# [Braider](http://braider.surge.sh/)
With thanks to [Rectangleworld](http://rectangleworld.com/blog/archives/733)

## What is this?
I've been fascinated with knotwork since the late nineties. Years ago I came across the above blog post but was made itchy by its lack of symmetry and enforcement of under-over patterns. I've since righted that wrong (not really a wrong, but hyperbole is important).

## How do I use?

1. Clone the repo
1. If you use `nvm` make sure you have `node@6.X.X` installed and `nvm use` (probably works with other node versions. But YMMV)
1. `npm i && npm start`
1. open `localhost:4000` in a browser and look at those sweet, sweet braids

## Deploying

1. `npm deploy`

Unless you're future-Joe you shouldn't be able to deploy to [http://braider.surge.sh/](http://braider.surge.sh/). But, if you'd like to fork and put up at another subdomain on surge, go right ahead.

## Future-Joe's Tasks

- [ ] Make it scrollable with a mouse
- [ ] Make it consume a serialized format
- [ ] Feed git log / branch output into it (not really)
