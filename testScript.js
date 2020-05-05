const http = require('http');

exports.handler = (event, context) => {
    console.log("test data");
    const quiz_ids = [2251,2252,2253,2254,2255]
    const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoic3VwZXIifQ.S_L4m99oQICRaa2GYvCLKtzHydKLZx21pBwMw3Ew2hQ';
    let promises = [];
    quiz_ids.forEach((id) => {
        promises.push(exports.testapi(id, token))
    })
    // promises.push(exports.testapi("suraj"));

    Promise.all(promises)
    .then((result) => {
        console.log('all resolved ', result)
    })
    return `Successfully processed ${event.Records.length} messages.`;
    
};

exports.testapi = function (quiz_id, jwt_token) {
    console.log("method call from api "+quiz_id);
     // sample API call from labda script
	return new Promise((resolve, reject) => {
        const options = {
            host: 'fs-asynch-process.graphql.myfreestone.rocks',
            headers: { 'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ jwt_token },
            method: 'POST'
        };

        const req = http.request(options, res => {
            
            //  console.log(res.headers);
            // console.log(`STATUS: ${res.statusCode}`);
        	var body = [];
        	//res.setEncoding('utf8');
            res.on('data', function(chunk) {
               body.push(chunk);
            });
            res.on('end', function() {
                // console.log(typeof(body));
                // console.log(body);
                body = JSON.parse(Buffer.concat(body).toString());
                console.log(body);
                resolve(body);
            });
         
        });

        req.on('error', (e) => {
            console.log("error part")
          reject(e.message);
        });
        //var quizid = 2251;
        var postData = JSON.stringify({ query: "query{ quiz(id:"+quiz_id+") { id, description } }",   variables: {} });

        // send the request
        req.write(postData);
        req.end();
    }); 
}
