const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', 'Key 80331bdb5b0b4d6ba2f8c4e24f54a114');

const API = (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: 'e466caa0619f444ab97497640cefc4dc',
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          'Received failed status: ' +
            response.status.description +
            '\n' +
            response.status.details
        );
        return;
      }

      const output = response.outputs[0].data.regions[0];
      console.log('Predicted concepts:');
      for (const concept of output.data.concepts) {
        console.log(concept.name + ' ' + concept.value);
      }
      res.json(response);
    }
  );
};

const image = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((data) => {
      res.json(data[0]);
    })
    .catch((err) => res.status(404).json('unable to get entries'));
};

module.exports = {
  handleImage: image,
  handleAPI: API,
};
