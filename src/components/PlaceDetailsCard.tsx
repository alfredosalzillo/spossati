import { PlaceResult } from '@api/places';
import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';

export type PlaceDetailsCardProps = {
  details: PlaceResult,
};
const PlaceDetailsCard: React.FunctionComponent<PlaceDetailsCardProps> = ({ details }) => {
  const photo = details.photos?.[0];
  return (
    <Card variant="outlined">
      {
        photo && (
          <CardMedia
            component="img"
            src={photo?.getUrl({
              maxHeight: 300,
            })}
            height="220"
          />
        )
      }
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {details.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="address">
          {details.formatted_address}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton onClick={() => window.open(details.url)} color="primary">
          <MapIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PlaceDetailsCard;
