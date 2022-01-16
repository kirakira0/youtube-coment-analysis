import { style } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';
import React, {useState} from 'react';
import { Navbar } from 'react-bootstrap';

// class LeftNavbar extends React.Component {
const LeftNavbar = (props) => {
  return (
    <Navbar className="leftNavbar">
      <h4>Youtube comment section analysis</h4>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">FAQ</a>
      <a href="#">Contact</a>
    </Navbar>
  );
};
export default LeftNavbar;