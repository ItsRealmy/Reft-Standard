const express = require("express");
const reft = require("./index");

const app = express();

app.listen(9090, () => console.log(`Listening on http://localhost:9090`));

app.use(express.json());

const reftRoute = reft({
  description: "Does nothing except send some example data.",
  data: {
    request: {
      helloWorld: `string - If the value is "Hello, world!" the response key "helloWorld" will be true, otherwise it will error out`
    },
    response: {
      helloWorld: `string - Will be true.`
    }
  },
  errors: [
    { code: "NOT_HELLO_WORLD", message: `Please enter "Hello, world!" in helloWorld.` }
  ]
});

app.post("/", reftRoute, (req, res) => {
  const { helloWorld } = req.data;

  if (helloWorld !== "Hello, world!") return res.error("NOT_HELLO_WORLD");
  else return res.reft({ helloWorld: true });
});