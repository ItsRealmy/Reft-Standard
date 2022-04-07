module.exports = (information = {
  endpoint: "",
  description: "",
  data: {
    request: { },
    response: { }
  },
  errors: [ { code: "", message: "" } ]
}) => {
  information.errors.push({ code: "ERR", message: "An unknown error occured." });

  return (req, res, next) => {
    // Set endpoint in information object
    if (!information.endpoint) information.endpoint = req.route.path;
    
    // Show information if requested
    if ((req.body && req.body._information) || req.query.information == "true") return res.send({
      reft: true,
      data: null,
      errors: false,
      information
    });

    // Get data
    if (req.body && req.body._data) req.data = (req.method == "GET") ? req.query : req.body._data;

    // Error function
    res.error = (code) => {
      const error = information.errors.find((i) => i.code == code) || information.errors.find((i) => i.code == "ERR");

      res.send({
        reft: true,
        data: null,
        errors: [error],
        information: null
      });
    };

    // Send regular reft response
    res.reft = (data) => {
      res.send({
        reft: true,
        data,
        errors: false,
        information: null
      });
    }

    return next();
  }
}