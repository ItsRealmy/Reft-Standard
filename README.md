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

#### Endpoint information
If someone wants to know more information about an endpoint (like what it does), they
must send a request where the key `_information` is set to `true`. If `_information`
is set to true, `_data` will be ignored by the server.

#### Example request
**Data request**:

We want to search through a database of web results.

```json
{
    "_data": {
        "query": "how to ", // The query the database is going to use to find results
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
PATCH and DELETE. Every response should send 3 keys in an object: `reft` (which is
set to `true`), `errors` and `data`. `reft` is just for identifying a Reft response,
`errors` is an array of errors (more on that later), and `data` is an object of data,
or `null` if there is no data to return.

#### Data responses
Again, the `data` object can be either an object or `null`. Like requests, keys in
`data` objects should be 