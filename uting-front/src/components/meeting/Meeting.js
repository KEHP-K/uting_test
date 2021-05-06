import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createGetAttendeeCallback, fetchMeeting } from '../../utils/api';
import routes from '../../constants/routes'
import {
    MeetingProvider,
    useMeetingManager
} from 'amazon-chime-sdk-component-library-react'
import { useAppState } from '../../providers/AppStateProvider';
import { ConsoleLogger } from 'amazon-chime-sdk-js';


export default function Meeting() {
    const history = useHistory();
    const meetingManager = useMeetingManager();
    const { setAppMeetingInfo, region: appRegion, meetingId: appMeetingId } = useAppState();
    // const [meetingId, setMeetingId] = useState(appMeetingId);
    // const [meetingErr, setMeetingErr] = useState(false);
    // const [name, setName] = useState('');
    // const [nameErr, setNameErr] = useState(false);
    // const [region, setRegion] = useState(appRegion);
    // const [isLoading, setIsLoading] = useState(false);
    // const { errorMessage, updateErrorMessage } = useContext(getErrorContext());
    
    const [room, setRoom] = useState({
        title:'', //방제
        num:0,    // 전체 방인원수 나누기 2
        status:'대기'  // 참가버튼 누르면 미팅중
    })
    const onChangehandler = e => {
        const { name, value } = e.target;
        setRoom({
            ...room,
            [name]: value
        })
        console.log('room form : ')
        console.log(room)
    };
    const makeRoom = async(e) => {
        e.preventDefault();

        const id = room.title.trim().toLocaleLowerCase();

        //setIsLoading(true);
        meetingManager.getAttendee = createGetAttendeeCallback(id);

        

        try {
            const { JoinInfo } = await fetchMeeting(id, room);
            await meetingManager.join({
                meetingInfo: JoinInfo.Meeting,
                attendeeInfo: JoinInfo.Attendee
            });
            
            // await meetingManager.start();
            setAppMeetingInfo(id, "Tester", 'us-east-1');
            history.push('/deviceSetup');
        } catch(error){
            console.log(error);
        }

        // try {
        //     
        // } catch(error){
        //     console.log(error);
        // }
        //await meetingManager.start();
        //history.push('/Rooms');
    };

    return (
        <React.Fragment>
            <input className="room-input" type='text' placeholder='방제목' onChange={onChangehandler} name='title' />
            <input type='number' min='1' max='4' placeholder='명수' onChange={onChangehandler} name='num'/>
            <button onClick={makeRoom}>방만들기</button>
        </React.Fragment>
    )
}

