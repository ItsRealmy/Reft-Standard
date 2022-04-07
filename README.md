<center>
<h1>Reft</h1>
A standard/spec that APIs can use (alongside a few libraries).
</center>

I made this standard because it's annoying to deal with a fuck ton of different APIs,
and I want to be able to easily use new APIs without letting my code adapt to it too
much.

## v1
I may make new versions of this standard (of course the libraries should be able to
adapt to various versions), so I decided to label this one `v1`.

### Request
A request is always JSON and either GET, POST, PATCH or DELETE.

#### Data requests
All data to send must be in an object titled `"_data"`, to ensure the server sends a
response that follows the Reft standard.

Keys in `_data` sent should be `camelCase`, for consistency sake.

#### No data requests
If there's no data to send to the server, `_data` must be set to `null`.

#### Information requests
If someone wants to know more information about an endpoint (like what it does), they
must send a request where the key `_information` is set to `true`. If `_information`
is set to true, `_data` will be ignored by the server.

#### GET requests
On GET requests the requester should use query parameters instead of JSON bodies (e.g
`?query=stackoverflow&from=0&limit=0`). If they want to request endpoint informantion,
set the query string to `?information=true`.

#### Example request
**Data request**:

We want to search through a database of web results.

```json
{
    "_data": {
        "query": "stackoverflow", // The query the database is going to use to find results
        "from": 0, // At what point the result list should start (for example, 2 will skip 2 results)
        "limit": 8 // How many results should be returned
    }
}
```

**No data request**:
```json
{
    "_data": null
}
```

**Information request**:
```json
{
    "_information": true
}
```

### Response
Like a request, the response should always be JSON and should only accept GET, POST,
PATCH and DELETE. Every response should send 4 keys in an object: `reft` (which is
set to `true`), `data`, `errors` and `information`. `reft` is just for identifying a
Reft response, `data` is an object of data or `null` if there is no data to return,
`errors` is an array of errors (more on that later), and `information` is endpoint
information if someone requested for it.

#### Data responses
If you have data, the `data` key should be an object. Like requests, keys in `data`
objects should be `camelCase`.

#### No data responses
If you don't have data (for example if you PATCHed something in your database) you
should set `data` to null.

#### GET requests
Because GET requests suck but are still a necessity, you should allow query strings
instead of JSON bodies. All query parameters should be used as type `string`. If the
request needs information instead of data, the query string will be
`?information=true`. We can "convert" a GET request from
`http://localhost/?key1=value1&key2=value2` to:

```json
{
    "_data": {
        "key1": "value1",
        "key2": "value2"
    }
}
```

#### Error response
On the server, if any errors occured you must add an error object to the `errors`
array, and set `data` to `null`. An error object consists of `code` and `message`,
 where `code` is a code meant to be used by the server (i.e. `QUERY_TOO_LONG`), and
`message` is a descriptive message of what the error means, which could possibly be
used in a UI. If no errors occured, `errors` can be set to `false`.

#### Information response
If `_information` in the request object is set to `true`, you must **only** send an
information object on the key `information` (make sure not to execute what the
request is supposed to do, this includes setting data to `null`). An example of an
information object/response is listed below. If no information is requested,
`information` can be set to `null`.

**Note**: Information objects shouldn't be "interpreted". It's only meant for the
creator of an application to know what an endpoint does, how it works and what
errors it could return. It's just API documentation.

#### Example response
**Data response**:

```json
{
    "reft": true,
    "data": {
        "results": [
            {
                "url": "https://stackoverflow.com/",
                "title": "Stack Overflow - Where Developers Learn, Share, & Build ...",
                "description": "A public platform building the definitive collection of coding questions & answers ... A community-based space to find and contribute answers to technical ..."
            },
            {
                "url": "https://stackoverflow.co/",
                "title": "Stack Overflow: Empowering the world to develop technology ...",
                "description": "Founded in 2008, Stack Overflow's public platform is used by nearly everyone who codes to learn, share their knowledge, collaborate, and build their ..."
            },
            {
                "url": "https://stackoverflow.blog/",
                "title": "Stack Overflow Blog - Essays, opinions, and advice on the act ...",
                "description": "The Stack Overflow Podcast is a weekly conversation about working in software development, learning to code, and the art and culture of computer programming ..."
            },
            ...
        ]
    },
    "errors": false,
    "information": null
}
```

**No data response**:

```json
{
    "reft": true,
    "data": null,
    "errors": false,
    "information": null
}
```

**Error response**:

```json
{
    "reft": true,
    "data": null,
    "errors": [
        { "code": "NO_QUERY", "message": "Please enter a query." }
    ],
    "information": null
}
```

**Information response**:

```json
{
    "reft": true,
    "data": null,
    "errors": false,
    "information": { // Information object example
        "endpoint": "/search",
        "description": "Search the web with results from Google.",
        "data": {
            "request": { // Keys with explainers how they should be used ([type(s) to accept] - [description])
                "query": "string - The query the database is going to use to find results",
                "from": "number - At what point the result list should start (for example, 2 will skip 2 results)",
                "limit": "number - How many results should be returned"
            },
            "response": {
                "results": "object[] - A list of scraped results", // If the type of a response key is array
                // or object, make 2 keys starting without and with an underscore, where the one without the
                // underscore is an explainer and the one with an underscore contains explainers of children
                // of the array or object.
                "_results": [
                    {
                        "url": "string - The URL that leads to the page.",
                        "title": "string - The metadata title of the page.",
                        "description": "string - The metadata description of the page."
                    }
                ]
            }
        },
        "errors": [ // Possible errors that can occur (consist of error objects)
            { "code": "NO_QUERY", "message": "Please enter a query." },
            { "code": "QUERY_TOO_LONG", "message": "The query you entered is too long." },
            { "code": "FROM_NEGATIVE", "message": "The value you entered in \"from\" should not be negative." },
            { "code": "LIMIT_NEGATIVE", "message": "The value you entered in \"limit\" should not be negative." }
        ]
    }
}
```