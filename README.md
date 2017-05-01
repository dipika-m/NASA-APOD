<div align="center">
  <img src="https://s3.amazonaws.com/qh-public/static/img/Quartet+%2B+NASA.png" width="300" />
  <h3>APOD React Exercise</h3>
</div>

#### Introduction

One of the most popular of all federal government websites is NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/apod/astropix.html) (APOD). For this exercise, you will build a React application that fetches and renders data about the APOD.

Check out the [APOD API Docs](https://api.nasa.gov/api.html#apod) for the few options offered.

#### Setup

Lucky for you, NASA maintains a public domain JSON API that provides the APOD imagery and associated metadata which you can find [here](https://api.nasa.gov/api.html#apod). To help you get started, we've created a boilerplate template containing libraries like [fetch](https://github.com/github/fetch) and [styled-components](https://styled-components.com/) that we'd like to see you use.

**To get started with the boilerplate:**

```sh
$ npm install
$ npm start
> Go to http://localhost:8080
```

#### Expectations and Requirements

- App should make a request using `fetch` to the NASA API shared above.
- App should render the title, explanation, and copyright of the image.
- App should render the image itself.
    - Sometimes the APOD is a video. App should account for this. [April 17, 2017 APOD video example.](https://apod.nasa.gov/apod/ap170417.html)
- There should be an input control where one can set the desired width the image should render in.
- If the width exceeds _1000px_ the app should use `hdurl` instead of `url` to render the image.
- App should leverage `styled-components` at a minimum to style the various views

#### FAQ

> Can I pull in additional libraries and/or tweak the app configuration?

**Absolutely, as long as `fetch` and `styled-components` are still used.**

> Do I need to introduce state management (i.e. Redux, Mobx)?

**It is not required to introduce state management libraries. With that said, clean separation of concerns and adopting patterns like container vs. presentation components can go a long way!**

> How much time should I spend on this?

**We'd like to see the exercise completed within 2-3 hours. It may seem like ample time given the narrow functional scope defined above, but we will be looking out for details spent on UI and UX that go above and beyond.**

> I have another question

**Don't hesitate to reach out: [eng-exercises@quartethealth.com](mailto:eng-exercises@quartethealth.com).**
