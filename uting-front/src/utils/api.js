import routes from '../constants/routes';

export const BASE_URL = routes.HOME;

// interface MeetingResponse { // .ts 로 작성되었을때 리턴 타입을 Promise로 정의하려고 사용하는 부분임.
//     JoinInfo: {
//         Attendee: any;
//         Meeting: any;
//     };
// }

export async function fetchMeeting(meetingId, name, region){
    const response = await fetch(
        `${BASE_URL}join?title=${encodeURIComponent(
            meetingId
        )}&name=${encodeURIComponent(name)}${
            region ? `$region=${encodeURIComponent(region)}` : ''
        }`,
        {
            method: 'POST'
        }
    );
    const data = await response.json();

    if(data.error){
        throw new Error(`Server error: ${data.error}`);
    }
    return data;
}

export function createGetAttendeeCallback(meetingId){
    return async (chimeAttendeeId, externalUserId) => {
        const attendeeUrl = `${BASE_URL}attendee?title=${encodeURIComponent(
            meetingId
        )}$attendee=${encodeURIComponent(chimeAttendeeId)}`;
        const res = await fetch(attendeeUrl, {
            method: 'GET'
        });

        if(!res.ok){
            throw new Error('Invalid server response');
        }

        const data = await res.json();

        return {
            name: data.AttendeeInfo.Name
        };
    };
}

export async function endMeeting(meetingId){
    const res = await fetch(
        `${BASE_URL}end?title=${encodeURIComponent(meetingId)}`,
        {
            method: 'POST'
        }
    );

    if(!res.ok){
        throw new Error('Server error ending meeting');
    }
}