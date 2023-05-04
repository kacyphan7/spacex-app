const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

// http://localhost:8000/index
 app.get('/index', function(req, res) {
    res.sendFile(__dirname+'/views/index.ejs');
  });

// http://localhost:8000/about
app.get('/about', function(req, res) {
    res.sendFile(__dirname+'/views/about.html');
});

// http://localhost:8000/blog-directory
app.get('/blog-directory', function(req, res) {
    res.sendFile(__dirname+'/views/blog-directory.html');
}); 

// http://localhost:8000/
app.get('/', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            // to find company ->
            console.log('data for /company: ', response.data)
            res.render('index', { company: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); 

app.get('/capsules', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /capsules: ', response.data)
            res.render('capsules', { capsules: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Scenario 1 - return a single capsule 
app.get('/capsules/:serial', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            console.log(response.data);
            //
            for (let i = 0; i < response.data.length; i++) {
                let capsule = response.data[i];
                let splitSerial = req.params.serial.split(''); // array ['c', '1', ...]
                let finalSerial = splitSerial[0].toUpperCase() + splitSerial.slice(1).join('');
                //upperCaseSerial[0].toUpperCase();
                //upperCaseSerial.join('');
                console.log('Uppercase Serial', finalSerial);
                // console.log('capsule', capsule)
                if (capsule.serial === finalSerial) {
                    return res.json({ capsule: capsule });
                }
            }
            return res.json({ message: 'Capsule does not exist' });
        })
        .catch(function (error) {
            //console.log(error);
            return res.json({ message: 'Data not found. Please try again later.' });
        });
}); 

// add * can show anything after a slash 
app.get('/capsules/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // print req.params
            console.log('req.params', req.params); // print an object
            console.log('api response', response.data); // print an array of capsules
            // run a for loop to search based of the key from req.params
            const capsuleArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let capsule = response.data[i];
                let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0'] parsing -> getting it into the format the will serve us...
                if (req.params['0'].includes('serial')) {
                    if (capsule.serial === userRequest[1].toUpperCase()) {
                        return res.json({ capsule });
                    }
                } else if (userRequest[0] === 'id') {
                    if (capsule.id === userRequest[1]) {
                        return res.json({ capsule });
                    }
                } else if (userRequest[0] === 'reuse_count') {
                    // check to see which capsule have the reuse count
                    // question: is the value of reuse_count a string or number when it comes in
                    // from the user...
                    let countValue = parseInt(userRequest[1]);
                    // check the count value
                    if (capsule.reuse_count === countValue) {
                        capsuleArray.push(capsule);
                    }
                } else if (userRequest[0] === 'water_landings') {
                    let countValue = parseInt(userRequest[1]);
                    if (capsule.water_landings === countValue) {
                        capsuleArray.push(capsule);
                    }
                } else if (userRequest[0] === 'land_landings') {
                    let countValue = parseInt(userRequest[1]);
                    if (capsule.land_landings === countValue) {
                        capsuleArray.push(capsule);
                    }
                } else if (userRequest[0] === 'last_update') {
                    let countValue = parseInt(userRequest[1]);
                    if (capsule.last_update === countValue) {
                        capsuleArray.push(capsule);
                    }
                } else if (userRequest[0] === 'status') {
                    let value = userRequest[1];
                    if (capsule.status === value) {
                        capsuleArray.push(capsule);
                    }
                } else if (userRequest[0] === 'type') {
                    let value = userRequest[1];
                    if (capsule.type === value) {
                        capsuleArray.push(capsule);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (capsuleArray.length < 1) {
                    return res.json({ message: 'Capsule is not found... Please try again.' });
                } else {
                    return res.json({ capsules: capsuleArray });
                }
            }
            return res.json({ capsules: capsuleArray });
        })
});

// http://localhost:8000/search?item=capsules&name=C103
app.get("/search", (req, res) => {
    let result = {};
    // { item: 'capsules', serial: 'C103' }
    // How would we make an axios when the item is different?
    axios.get(`https://api.spacexdata.com/v4/${req.query.item}`)
    .then(function(response) {
        for (let key in req.query) {
            if (key === 'item') {
                // do nothing
                continue;
            } else {
                // run for loop to search for key and value
                // key -> serial
                // req.query[key] -> C103
                for (let i = 0; i < response.data.length; i++) {
                    let dragon = response.data[i];
                    if (dragon.name === req.query[key]) { // if the response capsule.serial is equal the search item C103
                        return res.json({ dragon });
                    }
                }
            }
        }
        return res.json({ message: 'Data not found. Please try again...' })
    })
    .catch(function (error) {
        // console.log(error);
        return res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/company', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

/* app.get('/cores', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/cores', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /cores: ', response.data)
            res.render('cores', { cores: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single core by serial number: B0003 etc. http://localhost:8000/cores/B0003
app.get('/cores/:serial', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            for (let i = 0; i < response.data.length; i++) {
                let core = response.data[i];
                if (core.serial === req.params.serial) {
                    return res.json({ core: core });
                }
            }
            return res.json({ message: 'Core not found.' });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

// 5 conditional for cores http://localhost:8000/cores/serial/B1037
app.get('/cores/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            const coreArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let core = response.data[i];
                let userRequest = req.params['0'].split('/');
                if (userRequest[0] === 'serial') {
                    if (core.serial === userRequest[1].toUpperCase()) {
                        return res.json({ core });
                    }
                } else if (userRequest[0] === 'id') {
                    if (core.id === userRequest[1]) {
                        return res.json({ core });
                    }
                } else if (userRequest[0] === 'reuse_count') {
                    let countValue = parseInt(userRequest[1]);
                    if (core.status === 'active' && core.reuse_count === countValue) {
                        coreArray.push(core);
                    }
                } else if (userRequest[0] === 'status') {
                    let value = userRequest[1];
                    if (core.status === value) {
                        coreArray.push(core);
                    }
                } else if (userRequest[0] === 'launches') {
                    let value = userRequest[1];
                    if (core.launches.includes(value)) {
                        coreArray.push(core);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (coreArray.length < 1) {
                    return res.json({ message: 'Cores is not found... Please try again.' });
                } else {
                    return res.json({ cores: coreArray });
                }
            }
            return res.json({ cores: coreArray });
        })
});

/* app.get('/crew', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/crew', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /crew: ', response.data)
            res.render('crew', { crew: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single crew by agency: NASA, ESA etc. http://localhost:8000/crew/ESA
app.get('/crew/:agency', function (req, res) {
    const agency = req.params.agency;
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {
            const data = response.data.filter((crew) => crew.agency === agency);
            if (data.length > 0) {
                res.json({ data });
            } else {
                res.status(404).json({ message: `No crew members found for agency ${agency}` });
            }
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while fetching data' });
        });
});

/* app.get('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /dragons: ', response.data)
            res.render('dragons', { dragons: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single dragon by id: 5e9d058859b1ffd8e2ad5f90
app.get('/dragons/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) { // promise callback to return API 
            for (let i = 0; i < response.data.length; i++) { // iterating through array of Dragons returned by API
                let dragons = response.data[i]; // represents the current item in the loop iterationi 
                if (dragons.id === req.params.id) { // condidtional statement to check id property of dragon object matches balue or id route parameter
                    return res.json({ dragons: dragons }); // send JSON response containing an object with dragon properties that contains details of dragon
                }
            }
            return res.json({ message: 'Dragons not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// 5 conditional for dragons http://localhost:8000/dragons/id/5e9d058859b1ffd8e2ad5f90
app.get('/dragons/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            let dragonArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let dragon = response.data[i];
                let userRequest = req.params['0'].split('/');
                if (userRequest[0] === 'id') {
                    if (dragon.id === userRequest[1]) {
                        return res.json({ dragon });
                    }
                } else if (userRequest[0] === 'name') {
                    if (dragon.name.toLowerCase() === userRequest[1].toLowerCase()) {
                        return res.json({ dragon });
                    }
                } else if (userRequest[0] === 'type') {
                    if (dragon.type.toLowerCase() === userRequest[1].toLowerCase()) {
                        dragonArray.push(dragon);
                    }
                } else if (userRequest[0] === 'active') {
                    let value = userRequest[1].toLowerCase() === 'true';
                    if (dragon.active === value) {
                        dragonArray.push(dragon);
                    }
                } else if (userRequest[0] === 'crew_capacity') {
                    let value = parseInt(userRequest[1]);
                    if (dragon.crew_capacity === value) {
                        dragonArray.push(dragon);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (dragonArray.length < 1) {
                    return res.json({ message: 'Dragons is not found... Please try again.' });
                } else {
                    return res.json({ dragons: dragonArray });
                }
            }
            return res.json({ dragons: dragonArray });
        });
});

/* app.get('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /landpads: ', response.data)
            res.render('landpads', { landpads: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single landpads by id: 5e9e3032383ecb267a34e7c7
app.get('/landpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let landpads = response.data[i];
                if (landpads.id === req.params.id) {
                    return res.json({ landpads: landpads });
                }
            }
            return res.json({ message: 'Landpads not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// 5 conditional for landpads http://localhost:8000/landpads/region/Florida
app.get('/landpads/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            let landpadArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let landpad = response.data[i];
                let userRequest = req.params['0'].split('/');
                if (userRequest[0] === 'id') {
                    if (landpad.id === userRequest[1]) {
                        return res.json({ landpad });
                    }
                } else if (userRequest[0] === 'name') {
                    if (landpad.name.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ landpad });
                    }
                } else if (userRequest[0] === 'status') {
                    if (landpad.status === userRequest[1]) {
                        landpadArray.push(landpad);
                    }
                } else if (userRequest[0] === 'type') {
                    if (landpad.type === userRequest[1]) {
                        landpadArray.push(landpad);
                    }
                } else if (userRequest[0] === 'region') {
                    if (landpad.region.toUpperCase() === userRequest[1].toUpperCase()) {
                        landpadArray.push(landpad);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (landpadArray.length < 1) {
                    return res.json({ message: 'Landpads is not found... Please try again.' });
                } else {
                    return res.json({ landpads: landpadArray });
                }
            }
            return res.json({ landpads: landpadArray });
        });
});

/* app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /launches: ', response.data)
            res.render('launches', { launches: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single launches by id: 5eb87cdaffd86e000604b32b
app.get('/launches/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let launches = response.data[i];
                if (launches.id === req.params.id) {
                    return res.json({ launches: launches });
                }
            }
            return res.json({ message: 'Launches not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// 5 conditional for launches http://localhost:8000/launches/flight_number/1
app.get('/launches/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {
            let launchesArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let launch = response.data[i];
                let userRequest = req.params['0'].split('/');
                if (userRequest[0] === 'launchpad') {
                    if (launch.launchpad === userRequest[1]) {
                        launchesArray.push(launch);
                    }
                } else if (userRequest[0] === 'flight_number') {
                    if (launch.flight_number === parseInt(userRequest[1])) {
                        launchesArray.push(launch);
                    }
                } else if (userRequest[0] === 'name') {
                    if (launch.name.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchesArray.push(launch);
                    }
                } else if (userRequest[0] === 'date_unix') {
                    if (launch.date_unix === parseInt(userRequest[1])) {
                        launchesArray.push(launch);
                    }
                } else if (userRequest[0] === 'date_precision') {
                    if (launch.date_precision.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchesArray.push(launch);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (launchesArray.length < 1) {
                    return res.json({ message: 'Launches is not found... Please try again.' });
                } else {
                    return res.json({ launches: launchesArray });
                }
            }
            return res.json({ launches: launchesArray });
        });
});

/* app.get('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /launchpads: ', response.data)
            res.render('launchpads', { launchpads: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single launchpads by id: 5e9e4502f509094188566f88
app.get('/launchpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let payloads = response.data[i];
                if (payloads.id === req.params.id) {
                    return res.json({ payloads: payloads });
                }
            }
            return res.json({ message: 'Launchpads not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// 5 conditional for launchpads http://localhost:8000/launchpads/id/5e9e4502f509094188566f88
app.get('/launchpads/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            let launchpadArray = [];
            for (let i = 0; i < response.data.length; i++) {
                let launchpad = response.data[i];
                let userRequest = req.params['0'].split('/');
                if (userRequest[0] === 'id') {
                    if (launchpad.id === userRequest[1]) {
                        return res.json({ launchpad });
                    }
                } else if (userRequest[0] === 'status') {
                    if (launchpad.status === userRequest[1]) {
                        launchpadArray.push(launchpad);
                    }
                } else if (userRequest[0] === 'region') {
                    if (launchpad.region.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchpadArray.push(launchpad);
                    }
                } else if (userRequest[0] === 'name') {
                    if (launchpad.name.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchpadArray.push(launchpad);
                    }
                } else if (userRequest[0] === 'locality') {
                    if (launchpad.locality.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchpadArray.push(launchpad);
                    }
                } else {
                    return res.json({ message: 'Data is not found... Please try again.' });
                }
                if (launchpadArray.length < 1) {
                    return res.json({ message: 'Launchpads is not found... Please try again.' });
                } else {
                    return res.json({ launchpads: launchpadArray });
                }
            }
            return res.json({ launchpads: launchpadArray });
        });
});

/* app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            console.log('data for /payloads: ', response.data)
            res.render('payloads', { payloads: response.data })
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// return a single payloads by id: 61fc0334e0dc5662b76489b5
app.get('/payloads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let payloads = response.data[i];
                if (payloads.id === req.params.id) {
                    return res.json({ payloads: payloads });
                }
            }
            return res.json({ message: 'Payloads not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

/* app.get('/roadster', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/roadster')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/roadster', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/roadster')
        .then(function (response) {
            // handle success
            res.render('roadster', { message: '', roadster: response.data, searchBy: '', searchVal: '' });
        })
        .catch(function (error) {
            res.render('roadster', { message: 'Data not found. Please try again later.', searchBy: '', searchVal: '' });
        });
});

/* app.get('/rockets', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/rockets', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            res.render('rockets', { message: '', rockets: response.data, searchBy: '', searchVal: '' });
        })
        .catch(function (error) {
            res.render('rockets', { message: 'Data not found. Please try again later.', rockets: '', searchBy: '', searchVal: '' });
        });
});

// return a single rockets by id: 5e9d0d96eda699382d09d1ee
app.get('/rockets/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            for (let i = 0; i < response.data.length; i++) {
                let rockets = response.data[i];
                if (rockets.id === req.params.id) {
                    return res.json({ rockets: rockets });
                }
            }
            return res.json({ message: 'Rockets not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

/* app.get('/ships', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/ships', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            res.render('ships', { message: '', ships: response.data, searchBy: '', searchVal: '' });
        })
        .catch(function (error) {
            res.render('ships', { message: 'Data not found. Please try again later.', ships: '', searchBy: '', searchVal: '' });
        });
});

// return a single ship by id: 618fad7e563d69573ed8caa9
app.get('/ships/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            for (let i = 0; i < response.data.length; i++) {
                let ships = response.data[i];
                if (ships.id === req.params.id) {
                    return res.json({ ships: ships });
                }
            }
            return res.json({ message: 'Ships not found.' });
        })
        .catch(function (error) {
            console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

/* app.get('/starlink', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/starlink', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            res.render('starlink', { message: '', starlink: response.data, searchBy: '', searchVal: '' });
        })
        .catch(function (error) {
            res.render('starlink', { message: 'Data not found. Please try again later.', starlink: starlinkArray, searchBy: '', searchVal: '' });
        });
}); 

// return a single starlink by id: 5eed7714096e59000698565e
app.get('/starlink/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            for (let i = 0; i < response.data.length; i++) {
                let starlink = response.data[i];
                if (starlink.id === req.params.id) {
                    return res.json({ starlink: starlink });
                }
            }
            return res.json({ message: 'Starlink not found.' });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});


/* app.get('/history', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/history')
        .then(function (response) {
            // handle success
            //console.log(response.data);
            res.json({ data: response.data })
        })
        .catch(function (error) {
            //console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
}); */

app.get('/history', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/history')
        .then(function (response) {
            // handle success
            res.render('history', { message: '', history: response.data, searchBy: '', searchVal: '' });
        })
        .catch(function (error) {
            res.render('history', { message: 'Data not found. Please try again later.', history: '', searchBy: '', searchVal: '' });
        });
});

// return a single hisotry by id: 5f6fb37ddcfdf403df379723
app.get('/history/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/history')
        .then(function (response) {
            // handle success
            for (let i = 0; i < response.data.length; i++) {
                let history = response.data[i];
                if (history.id === req.params.id) {
                    return res.json({ history: history });
                }
            }
            return res.json({ message: 'History not found.' });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/:input', function (req, res) {

    console.log('REQ.PARAMS ->', req.params)

    res.json({ message: `There is no data for /${req.params.input}` });
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
    console.log('Server is running on PORT', PORT);
});

module.exports = {
    app,
    PORT,
} 