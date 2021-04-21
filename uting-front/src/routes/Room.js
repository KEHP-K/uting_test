import React,{useEffect, useState} from "react";
import styled from 'styled-components';
import { InputGroup, InputGroupAddon, InputGroupText, Input,Button, Form, FormGroup, Label, FormText ,Badge} from 'reactstrap';
import axios from 'axios';
import McBot from '../components/mc/McBot'
import Rooms from '../components/meeting/Rooms'

const Room = () => {


  return (
    <div>
      Room
      <Rooms></Rooms>
      <McBot></McBot>
    </div>
  );
};

export default Room;
