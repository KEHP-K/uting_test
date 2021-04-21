import React from 'react'
import {
    VideoTileGrid,
    UserActivityProvider
} from 'amazon-chime-sdk-component-library-react';




export default function Rooms() {
    return (
        <div>
            <UserActivityProvider>
                <VideoTileGrid></VideoTileGrid>
            </UserActivityProvider>
        </div>

    );
}
