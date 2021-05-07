var express = require('express');
var router = express.Router();
const { Meeting }=require('../model');


const fs = require('fs');
const uuid = require('uuid/v4');
const AWS = require('aws-sdk');
const { response } = require('express');
/* eslint-enable */

let hostname = '127.0.0.1';
let port = 8080;
let protocol = 'http';
let options = {};

const chime = new AWS.Chime({ region: 'us-east-1' });
const alternateEndpoint = process.env.ENDPOINT;
if (alternateEndpoint) {
  console.log('Using endpoint: ' + alternateEndpoint);
  chime.createMeeting({ ClientRequestToken: uuid() }, () => {});
  AWS.NodeHttpClient.sslAgent.options.rejectUnauthorized = false;
  chime.endpoint = new AWS.Endpoint(alternateEndpoint);
} else {
  chime.endpoint = new AWS.Endpoint(
    'https://service.chime.aws.amazon.com/console'
  );
}

// @TODO 밑에 캐시 두 개 데이터 베이스에 넣어서 관리하면 될 것 같습니둥
const meetingCache = {};
const attendeeCache = {};

const log = message => {
  console.log(`${new Date().toISOString()} ${message}`);
};

const app = process.env.npm_config_app || 'meeting';


// GET meetings list 
router.get('/', async function(req, res, next) {
  Meeting.find({}).then((meetings)=>{ 
    res.json(meetings);
  });
  //res.json(meetings);
});

// GET one meeting
router.get('/attendee?', async function (req, res, next) {
  // const meeting = await Meeting.findOne({ _id: req.params.id });

  const title = req.query.title;
  const attendee = req.query.attendee;

  const attendeeInfo = {
    AttendeeInfo: {
      AttendeeId: attendee,
      Name: attendeeCache[title][attendee]
    }
  };
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(attendeeInfo), 'utf8');
  res.end();

  console.log(req.query.title)
  console.log(req.query.attendee)
});


// GET one meeting
// router.get('/attendee:id', async function(req, res, next) {
//   const meeting = await Meeting.findOne({_id:req.params.id});
//   res.json(meeting);
// });

// POST write one meeting
router.post('/join', async function(req, res, next){
  
  console.log(req.body);
  const meeting = new Meeting({
    title:req.body.title,
    num:req.body.num,
    status:req.body.status
  });

  const title = meeting.title;
  const name = "Tester"; // @TODO 세션을활용해서 Nickname 넣어주기
  const region = "us-east-1"
  
  if (!meetingCache[title]){
    meetingCache[title] = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: region
      }).promise();
      attendeeCache[title] = {};
  }
  const joinInfo = {
    JoinInfo: {
      Title: title,
      Meeting: meetingCache[title].Meeting,
      Attendee: (
        await chime
          .createAttendee({
            MeetingId: meetingCache[title].Meeting.MeetingId,
            ExternalUserId: uuid()
          }).promise()).Attendee
    }
  };
  attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;

  
  meeting.save();
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(joinInfo), 'utf8');
  res.end();
})

// PUT edit one meeting
router.put('/:id', async function(req,res,next){
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body);
  //res.json(meeting);
})

// DELETE one meeting
router.delete('/delete/:id', async function(req,res,next){
  const title = req.params.id;
  Meeting.deleteOne({_id : title}); // @TODO : 이거 params으로 못넘길듯? encrypted되는걸로알고있음.

  // await chime
  //   .deleteMeeting({
  //     MeetingId: meetingCache[title].Meeting.MeetingId
  //   })
  //    .promise();
  //   response.statusCode = 200;
  //   response.end();
  //   res.send("The meeting is terminated successful");
});

module.exports = router;
