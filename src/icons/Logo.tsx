import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';

export type LogoProps = SvgIconProps;
const Logo: React.FunctionComponent<LogoProps> = (props) => (
  <SvgIcon viewBox="0 0 512 512" {...props}>
    <path
      d="m389.16668,118.83334l-271.33334,0c-18.82375,0 -33.74709,15.31541 -33.74709,34.41666l-0.16958,206.50001c0,19.10125 15.09292,34.41667 33.91667,34.41667l84.79167,0l0,-34.41667l-84.79167,0l0,-103.25l305.25001,0l0,-103.25001c0,-19.10125 -15.09292,-34.41666 -33.91667,-34.41666zm0,68.83333l-271.33334,0l0,-34.41667l271.33334,0l0,34.41667zm-85.97875,192.21709l-47.99209,-48.69958l-23.91125,24.26375l71.90334,73.13542l119.89542,-121.66292l-23.91125,-24.26375l-95.98417,97.22708z"
    />
  </SvgIcon>
);

export default Logo;
