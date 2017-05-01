<div align="center">
  <img src="https://s3.amazonaws.com/qh-public/static/img/Quartet+%2B+NASA.png" width="300" />
  <h3>APOD React Exercise</h3>
</div>

#### Introduction

One of the most popular of all federal government websites is NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) (APOD). Here, I have built a React application that fetches and renders either and image of video depending on the current APOD.

Check out the [APOD API Docs](https://api.nasa.gov/api.html#apod) for the few options offered.

#### Setup

NASA maintains a public domain JSON API that provides the APOD imagery and associated metadata which you can find [here](https://api.nasa.gov/api.html#apod). Boilerplate template containing libraries like [fetch](https://github.com/github/fetch) and [styled-components](https://styled-components.com/) are used here.

**To get started with the boilerplate:**

```sh
$ npm install
$ npm start
> Go to http://localhost:8080
```

#### What is being done

- This app makes a request using `fetch` to the NASA API shared above.
- App renders the title, explanation, and copyright of the image.
- App renders the image itself.
    - Sometimes the APOD is a video. App also accounts for this. [April 17, 2017 APOD video example.](https://apod.nasa.gov/apod/ap170417.html)
- An input control has been added where one can set the desired width the image should render in.
- If the width exceeds _1000px_ the app uses `hdurl` instead of `url` to render the image.
- App leverages `styled-components` at a minimum to style the various views
- Additional component for full screen viewing has been added

#### Future work/potential issues
- Navigation logic for viewing multiple images is added.
- CSS and other styling components still need to be added for multi images
- Archive function possible with above additions, but needs to be added
- Improvement needs to be made to the UI/IX from the current scheme
- Some potential issues with full screen mode need to be fixed


