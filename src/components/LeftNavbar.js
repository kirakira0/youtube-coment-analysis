import { style } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';
import React, {useState} from 'react';

// class LeftNavbar extends React.Component {
const LeftNavbar = (props) => {
  return (
    <div className="leftNavbar" style={{width: props.width}}>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">FAQ</a>
      <a href="#">Contact</a>
    </div>
  );
};
export default LeftNavbar;