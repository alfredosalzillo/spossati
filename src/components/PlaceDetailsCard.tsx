import { PlaceResult } from '@api/places';
import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia, createStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 200,
    transition: theme.transitions.create('height'),
  },
}));

export type PlaceDetailsCardProps = {
  details: PlaceResult,
};
const PlaceDetailsCard: React.FunctionComponent<PlaceDetailsCardProps> = ({ details }) => {
  const classes = useStyles();
  const photo = details.photos?.[0];
  return (
    <Card variant="outlined" className={classes.root}>
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
