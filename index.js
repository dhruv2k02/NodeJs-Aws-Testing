const express = require('express');
const app = express();
const ip = require('ip');
app.get('/', (req, res) => {
  // display the my name is dhruv
    res.send('Welcome to my website\nMy device IP address is ' + ip.address());  

});
//check wether server is healhty or not to aws by senging a respond code 200    


app.get('/health', (req, res) => {
    res.status(200).send('Server is healthy');
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');        
});

