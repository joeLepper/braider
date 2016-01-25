# DOTS

## Hi there.

You've probably come from [here](joelepper.com).

## Welcome.

If you've arrived from github at large, go check the site out so you know what you're looking at. The code's pretty simple. There's a little webpack build that's mostly useful for injecting variables for the build process and the artifact to share. It's mostly used during dev. It gets invoked before prod but is mostly to copy files around. There's a teeny-tiny little react component that produces the markup. This is run to server-side render the HTML for our JS to take over. It let's the user pass in query params to alter the columns and rows. But if the ratio of columns to rows isn't 16:9 Bad Things™ happen.

From there the ~1.5K of JS takes over to grab a stream from your webcam, print it to a `canvas` and then alter the `fill` attributes of some `svg` `circles`.

## Development.

Development is done by running `npm start` with both a `COLUMNS` and a `ROWS` variable. Of course there's sensible defaults. But feel free to play around with different values. the `start` script just fires up the express server and listens to 3000. `bundle.js` will be updated as you work.

Any changes you make to the static HTML generator will require a server bounce.

Thanks for your interest.