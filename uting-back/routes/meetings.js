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
router.get('/:id', async function(req, res, next) {
  const meeting = await Meeting.findOne({_id:req.params.id});
  //res.json(meeting);
});

// POST write one meeting
router.post('/', async function(req, res,next){
  const meeting = new Meeting({
    title:req.body.title,
    num:req.body.num,
    status:req.body.status
  });

  const title = meeting.title;
  const name = "백승수"; // @TODO 요청한 유저 이름을 넣어야함
  const region = "us-east-1"
  
  if (!meetingCache[title]){
    meetingCache[title] = await chime
      .createMeeting({
        ClientRequestToken: uuid(),
        MediaRegion: region
      })
      .promise();
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
          })
          .promise()
      ).Attendee
    }
  };
  attendeeCache[title][joinInfo.joinInfo.Attendee.AttendeeId] = name;
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(joinInfo), 'utf8');
  res.end();
  
  meeting.save((err)=>{
    res.send("방을 생성하였습니다.")
  });
})

// PUT edit one meeting
router.put('/:id', async function(req,res,next){
  const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body);
  //res.json(meeting);
})

// DELETE one meeting
router.delete('/:id', async function(req,res,next){
  const meeting = await Meeting.deleteOne({_id : req.params.id});
  //res.json(meeting);
});

module.exports = router;
