const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || 5000;

// Initialize App
const app = express();

// BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Server Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Validate Form Fields
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct Request Data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  }

  // Stringify Request Data
  const postData = JSON.stringify(data);

  const options = {
    url: 'https://<your-data-center>.api.mailchimp.com/3.0/lists/<your-list-id>',
    method: 'POST',
    headers: {
      Authorization: 'auth <your-api-key>'
    },
    body: postData,
  }

  request(options, (err, response, body) => {
    if (err) {
      res.redirect('/fail.html');
      
    } else {
      if (response.statusCode === 200) {
        res.redirect('/success.html');
        return;
      } else {
        res.redirect('fail.html');
        return;
      }
    }
  });
});

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}...`));
