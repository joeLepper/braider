# DOTS!

## Hi there.

You've probably come from [here](joelepper.com).

## Welcome.

If you've arrived from github at large, go check the site out so you know what you're looking at. The code's pretty simple. There's a little webpack build that's mostly useful for injecting variables for the build process and the artifact to share. It's mostly used during dev. It gets invoked before prod but is mostly to copy files around. There's a teeny-tiny little react component that produces the markup. This is run to server-side render the HTML for our JS to take over.

The server let's the user pass in query params to alter the columns. But if the ratio of columns to rows isn't 16:9 Bad Things™ happen. So we use that query param as a strong suggestion and just choose something sensible that won't make the browser eat the user's CPU. More on this below in _Visiting_.

From there the ~1.5K of JS takes over to grab a stream from your webcam, print it to a `canvas` and then alter the `fill` attributes of some `svg` `circles`.

## Development.

Development is done by running `npm run staging`.

Any changes you make to the static HTML generator will require a server bounce.

## Deployment.

Use forever. Tell it to `npm run prod`. Tell it about the email address associated with the domain.

## Visiting

The site's pretty straightforward. Visit the site root to see the visualization. Visit the site root with a query string to set different options. Here's a few different examples that cover the base cases:

- `?cols=128` will set the columns used in the visualization to 128. The number of rows will respond appropriately. 128 is the max number of columns.
- `?cols=120` will also set the columns to 128. The number of columns is restrained to values which work well with the math driving the visualization. 128 is the max. 16 is the least. Thirty-two and 64 are the other options.
- `?brand=0` will turn off the branding. This is nice if you want to play with the visualization but don't care who I am or where my Twitter is.

Thanks for your interest.