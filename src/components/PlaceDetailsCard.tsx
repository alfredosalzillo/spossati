import { PlaceResult } from '@api/places';
import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia, createStyles, Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PlaceReviewsSummary from '@components/PlaceReviewsSummary';
import AddReviewBox from '@components/AddReviewBox';
import Authenticated from '@auth/Authenticated';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    minHeight: 100,
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
            src={photo?.getUrl({ maxWidth: 500 })}
            height="150"
          />
        )
      }
      <CardContent component="div">
        <Typography gutterBottom variant="h5" component="h2">
          {details.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="address" gutterBottom>
          {details.formatted_address}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <PlaceReviewsSummary placeId={details.place_id} />
          </Grid>
          <Grid item xs={12}>
            <Authenticated>
              <AddReviewBox placeId={details.place_id} />
            </Authenticated>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions style={{ flexDirection: 'row-reverse' }}>
        <IconButton onClick={() => window.open(details.url)} color="primary">
          <MapIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PlaceDetailsCard;
