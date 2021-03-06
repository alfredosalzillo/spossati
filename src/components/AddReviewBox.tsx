import React from 'react';
import useSession from '@auth/use-session';
import {
  Button, ButtonGroup, Collapse, FormControl, Paper, Typography
} from '@material-ui/core';
import { useClient, useSelect, useSelectKey } from 'supabase-swr';

type YDN = 'Y' | 'D' | 'N';
type Review = {
  id: string,
  user_id: string,
  place_id: string,
  card_payment_accepted: YDN,
  reason?: string,
  created_at: string
};
const useCurrentUserReview = (placeId: string) => {
  const session = useSession();
  const userId = session.user.id;
  const key = useSelectKey<Review>('reviews', {
    columns: '*',
    filter: (query) => query
      .filter('user_id', 'eq', userId)
      .filter('place_id', 'eq', placeId)
      .order('created_at', { ascending: false })
      .limit(1),
  }, [userId, placeId]);
  return useSelect<Review>(key, {
    shouldRetryOnError: false,
  });
};
type AddReviewBoxProps = {
  placeId: string,
};
const AddReviewBox: React.FunctionComponent<AddReviewBoxProps> = ({
  placeId,
}) => {
  const {
    isValidating,
    data,
    mutate,
  } = useCurrentUserReview(placeId);
  const client = useClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addReview = (cardPaymentAccepted: YDN) => {
    client.from<Review>('reviews').upsert({
      place_id: placeId,
      card_payment_accepted: cardPaymentAccepted,
    })
      .filter('place_id', 'eq', placeId)
      .then(() => mutate());
  };
  const review = data?.data?.[0];
  if (review) {
    return (
      <Collapse in={!isValidating}>
        <Paper variant="outlined" component="form" style={{ padding: 12 }}>
          <Typography variant="body2" gutterBottom>
            Are card payment accepted?
            {' '}
            <strong>{review.card_payment_accepted}</strong>
          </Typography>
          <Typography variant="caption" gutterBottom>
            You left this review at
            {' '}
            <strong>{new Intl.DateTimeFormat().format(new Date(review.created_at))}</strong>
          </Typography>
        </Paper>
      </Collapse>
    );
  }
  return (
    <Collapse in={!review && !isValidating}>
      <Paper variant="outlined" component="form" style={{ padding: 12 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Evaluate you experience
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <Typography variant="body2" component="label" gutterBottom>
            Are card payment accepted?
          </Typography>
          <ButtonGroup size="small" color="primary" fullWidth>
            <Button value="Y" onClick={() => addReview('Y')}>
              Yes
            </Button>
            <Button value="D" onClick={() => addReview('D')}>Not sure</Button>
            <Button value="N" onClick={() => addReview('N')}>No</Button>
          </ButtonGroup>
        </FormControl>
      </Paper>
    </Collapse>
  );
};

export default AddReviewBox;
